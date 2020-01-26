import isPromise from "is-promise";

import {Middleware} from "../getStore";
import {errorLike, ErrorLike} from "../utils";

const $status = Symbol("$status");

type Status = {
    readonly processing: boolean;
    readonly complete: boolean;
    readonly error?: ErrorLike;
}

export type DecoratedWithStatus = {
    readonly [$status]?: Status;
}

const Status = (status?: Partial<Status>): Status => ({
    processing: false,
    complete: false,
    ...status
});

const decorateWithStatus = <P extends DecoratedWithStatus>(status?: Partial<Status>, payload?: P): P & DecoratedWithStatus => ({
    ...payload || {} as P,
    [$status]: Status(status)
});

export const getStatus = <P extends DecoratedWithStatus>(payload?: P): Status => (payload && payload[$status]) || Status();

export const simplePromiseDecorator: Middleware = async (action, next) => {
    if (isPromise(action.payload)) {
        try {
            next({
                ...action,
                payload: decorateWithStatus({
                    processing: true
                })
            });

            next({
                ...action,
                payload: decorateWithStatus({
                    complete: true
                }, await action.payload)
            });
        } catch(error) {
            next({
                ...action,
                payload: decorateWithStatus({
                    error: errorLike(error)
                }),
                error: true
            });
        }
    } else {
        next(action);
    }
};
