import {put, cancelled, fork, take, cancel, retry} from "redux-saga/effects";
import uuid from "uuid";
import {isFunction} from "lodash";

import {ErrorLike} from "components/error";
import {Task} from "@redux-saga/types";

const symbolCancelled = Symbol("cancelled");

type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
type WithOptional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

type StandardAction<P = any, M = any> = {
    type: string;
    payload?: P;
    meta?: M;
    error?: boolean;
}

type Callback = {
    (): void;
}

export type Cancel = {
    (cb: Callback): Callback;
    [symbolCancelled]: () => void;
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

type Pending = {
    [key: string]: {
        task: Task;
        action: StandardAction;
    };
}

type Done = {
    (action: StandardAction): void;
}




const Cancel = function(): Cancel {
    let callback: Callback;

    const canceller = (cb: Callback) => callback = cb;
    (canceller as Cancel)[symbolCancelled] = () => callback && callback();

    return canceller as Cancel;
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

const getName = (action: StandardAction) => `${action.type}${action.meta.id ? `-${action.meta.id}`: ""}`;

const payloadCreator = (response: any) => (...args: any[]) => (isFunction(response) && response(...args)) || response;

function* callAsyncWithCancel(action: StandardAction, done?: Done, ...args: any[]) {
    const transactionId = uuid.v4();
    const cancel = Cancel();

    try {
        yield put({
            ...action,
            payload: action?.meta?.seedPayload,
            meta: decorateWithStatus(transactionId,{
                processing: true
            }, action.meta)
        });

        // TODO: refactor / allow configuration on retry
        const payload = yield retry(5, 1000, payloadCreator(action.payload(cancel)), ...args);

        yield put({
            ...action,
            payload,
            meta: decorateWithStatus(transactionId,{
                complete: true
            }, action.meta)
        });

        action?.meta?.response && action?.meta?.response.resolve(payload);
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

        action?.meta?.response && action?.meta?.response.reject(error);
    } finally {
        if (yield cancelled()) {
            cancel[symbolCancelled]();

            yield put({
                ...action,
                payload: [],
                meta: decorateWithStatus(transactionId,{
                    cancelled: true
                }, action.meta)
            });
        } else {
            done && done(action);
        }
    }
}

const takeAsync = (saga: (...args: any[]) => any, ...args: any[]) => fork(function*() {
    const pending: Pending = {};

    const done: Done = action => delete pending[getName(action)];

    while (true) {
        const action = yield take((action: StandardAction) => isFunction(action.payload));
        const name = getName(action);

        if (pending[name] && name === getName(pending[name].action)) {
            yield cancel(pending[name].task);
        }

        pending[name] = {
            task: yield fork(saga, ...[action, done, ...args]),
            action
        };
    }
});

export function* sagaAsyncAction(...args: any[]) {
    return yield takeAsync(callAsyncWithCancel, ...args);
}
