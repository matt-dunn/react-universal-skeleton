import {put, cancelled, fork, take, cancel} from "redux-saga/effects";
import uuid from "uuid";
import {isFunction} from "lodash";
import {Task} from "@redux-saga/types";

import {MetaStatus, ActionMeta} from "components/state-mutate-with-status";
import {notifyAction, Severity} from "components/redux/middleware/sagaNotification";

const symbolCancelled = Symbol("cancelled");

type StandardAction<P = any, M extends ActionMeta = ActionMeta> = {
    type: string;
    payload?: P;
    meta?: M;
    error?: boolean;
};

type Callback = {
    (): void;
}

export type Cancel = {
    (cb: Callback): Callback;
    [symbolCancelled]: () => void;
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

const decorateMetaWithStatus = <M extends ActionMeta>(transactionId: string, status?: Partial<MetaStatus>, meta?: M): M & ActionMeta => ({
    ...meta || {} as M,
    $status: MetaStatus({...status, transactionId})
});

const getName = (action: StandardAction) => `${action.type}${action?.meta?.id ? `-${action.meta.id}`: ""}`;

const payloadCreator = (response: any) => (...args: any[]) => (isFunction(response) && response(...args)) || response;

function* callAsyncWithCancel(action: StandardAction, done?: Done, ...args: any[]) {
    const transactionId = uuid.v4();
    const cancel = Cancel();

    try {
        yield put({
            ...action,
            payload: action?.meta?.seedPayload,
            meta: decorateMetaWithStatus(transactionId,{
                processing: true,
                processedOnServer: !(process as any).browser,
            }, action.meta)
        });

        const payload = yield payloadCreator(action.payload(cancel))(...args);
        // TODO: refactor / allow configuration on retry
        // const payload = yield retry(5, 1000, payloadCreator(action.payload(cancel)), ...args);

        yield put({
            ...action,
            payload,
            meta: decorateMetaWithStatus(transactionId,{
                complete: true,
                processedOnServer: !(process as any).browser,
                lastUpdated: Date.now()
            }, action.meta)
        });

        action?.meta?.response && action?.meta?.response.resolve(payload);
    } catch (error) {
        const {code, status} = error;
        yield put(notifyAction({message: error.message, reference: code && [code, status].filter(value => value).join("-"), severity: Severity.error}));

        yield put({
            ...action,
            payload: error,
            error: true,
            meta: decorateMetaWithStatus(transactionId,{
                hasError: true,
                error,
                processedOnServer: !(process as any).browser
            }, action.meta)
        });

        action?.meta?.response && action?.meta?.response.reject(error);
    } finally {
        if (yield cancelled()) {
            cancel[symbolCancelled]();

            yield put({
                ...action,
                payload: [],
                meta: decorateMetaWithStatus(transactionId,{
                    cancelled: true,
                    processedOnServer: !(process as any).browser
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
