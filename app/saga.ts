import {put, cancelled} from "redux-saga/effects";
import uuid from "uuid";
import {ErrorLike} from "./containers/State/simpleState";

export type StandardAction<P = any, M = any> = {
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

const Cancel = function(): Cancel {
    let callback: Callback;

    return {
        on: cb => callback = cb,
        cancelled: () => callback && callback()
    };
};

// const $status = Symbol("$status");

type Status = {
    readonly transactionId: string;
    readonly processing: boolean;
    readonly complete: boolean;
    readonly hasError? : boolean;
    readonly error?: ErrorLike;
    readonly cancelled?: boolean;
}

export type DecoratedWithStatus = {
    readonly $status?: Status;
}

type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
type WithOptional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

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
            meta: decorateWithStatus(transactionId,{
                processing: true
            })
        });

        const user = yield caller(action, cancel);

        yield put({
            ...action,
            payload: user,
            meta: decorateWithStatus(transactionId,{
                complete: true
            })
        });
    } catch (error) {
        yield put({
            ...action,
            meta: decorateWithStatus(transactionId,{
                hasError: true,
                error
            })
        });
    } finally {
        if (yield cancelled()) {
            cancel.cancelled();

            yield put({
                ...action,
                meta: decorateWithStatus(transactionId,{
                    cancelled: true
                })
            });
        }
    }
}
