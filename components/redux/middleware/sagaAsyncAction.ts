import {put, cancelled, fork, take, cancel} from "redux-saga/effects";
import uuid from "uuid";
import {isFunction} from "lodash";
import isPromise from "is-promise";
import {Task} from "@redux-saga/types";

import {StandardAction, MetaStatus, ActionMeta} from "components/state-mutate-with-status";

type Pending = {
    [key: string]: {
        task: Task;
        action: StandardAction;
    };
}

type Done = {
    (action: StandardAction): void;
}

export type PayloadCreator<A extends any[], R> =
    R
    |
    {
        (signal?: AbortSignal): {
            (...args: A): R;
        };
    }
    |
    {
        (signal?: AbortSignal): R;
    }



const decorateMetaWithStatus = <M extends ActionMeta>(transactionId: string, status: Partial<Omit<MetaStatus, "transactionId">>, meta?: M): M & ActionMeta => ({
    ...meta || {} as M,
    $status: MetaStatus({processing: false, ...status, transactionId})
});

const getName = (action: StandardAction) => `${action.type}${action?.meta?.id ? `-${action.meta.id}`: ""}`;

export const payloadCreator = <P extends PayloadCreator<any, any>>(response: P) => (signal?: AbortSignal) => (...args: Parameters<P | any>) => {
    if (isFunction(response)) {
        const ret = response(signal);

        if (isFunction(ret)) {
            return ret(...args);
        } else {
            return ret;
        }
    }

    return response;
};

function* callAsyncWithCancel(action: StandardAction, done?: Done, ...args: any[]) {
    const transactionId = uuid.v4();
    const controller = new AbortController();

    try {
        yield put({
            ...action,
            payload: action?.meta?.seedPayload,
            meta: decorateMetaWithStatus(transactionId,{
                lastUpdated: undefined,
                processing: true,
            }, action.meta)
        });

        const payload = yield payloadCreator(action.payload)(controller.signal)(...args);
        // TODO: refactor / allow configuration on retry
        // const payload = yield retry(5, 1000, payloadCreator(action.payload)(controller.signal)(...args);

        yield put({
            ...action,
            payload,
            meta: decorateMetaWithStatus(transactionId,{
                lastUpdated: Date.now()
            }, action.meta)
        });

        action?.meta?.response && action?.meta?.response.resolve(payload);
    } catch (error) {
        yield put({
            ...action,
            payload: error,
            error: true,
            meta: decorateMetaWithStatus(transactionId,{
                error,
            }, action.meta)
        });

        action?.meta?.response && action?.meta?.response.reject(error);
    } finally {
        if (yield cancelled()) {
            controller.abort();

            yield put({
                ...action,
                payload: [],
                meta: decorateMetaWithStatus(transactionId,{
                    cancelled: true,
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
        const action = yield take((action: StandardAction) => isFunction(action.payload) || isPromise(action.payload));
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
