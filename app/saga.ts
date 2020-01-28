import {put, cancelled} from "redux-saga/effects";
import uuid from "uuid";
import {ErrorLike} from "./containers/State/simpleState";

type StandardAction<P = any, M = any> = {
    type: string;
    payload?: P;
    meta?: M;
    error?: boolean;
}

type Callback = {
    (): void;
}

type Cancel = {
    on: (cb: Callback) => Callback;
    cancelled: () => void;
}

type Caller = {
    (action: StandardAction, cancel: Cancel): void;
}

type Status = {
    readonly transactionId: string;
    readonly processing: boolean;
    readonly complete: boolean;
    readonly hasError? : boolean;
    readonly error?: ErrorLike;
    readonly cancelled?: boolean;
}

type DecoratedWithStatus = {
    readonly $status?: Status;
}

type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
type WithOptional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;




const Cancel = function(): Cancel {
    let callback: Callback;

    return {
        on: cb => callback = cb,
        cancelled: () => callback && callback()
    };
};

const Status = (status: WithOptional<Status, "hasError" | "error" | "cancelled" | "processing" | "complete">): Status => ({
    processing: false,
    complete: false,
    ...status
});

const decorateWithStatus = <M extends DecoratedWithStatus>(transactionId: string, status?: Partial<Status>, meta?: M): M & DecoratedWithStatus => ({
    ...meta || {} as M,
    $status: Status({...status, transactionId})
});

export const createPattern = (type: string) => (action: StandardAction) => (action.type === type && !action?.meta?.$status);

export function* callAsyncWithCancel(caller: Caller, action: StandardAction) {
    const transactionId = uuid.v4();
    const cancel = Cancel();

    try {
        yield put({
            ...action,
            payload: undefined,
            meta: decorateWithStatus(transactionId,{
                processing: true
            }, action.meta)
        });

        const payload = yield caller(action, cancel);

        yield put({
            ...action,
            payload,
            meta: decorateWithStatus(transactionId,{
                complete: true
            }, action.meta)
        });
    } catch (error) {
        yield put({
            ...action,
            payload: error,
            error: true,
            meta: decorateWithStatus(transactionId,{
                hasError: true,
                error
            }, action.meta)
        });
    } finally {
        if (yield cancelled()) {
            cancel.cancelled();

            yield put({
                ...action,
                payload: [],
                meta: decorateWithStatus(transactionId,{
                    cancelled: true
                }, action.meta)
            });
        }
    }
}
