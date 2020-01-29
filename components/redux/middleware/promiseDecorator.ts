import {Dispatch, Middleware} from "redux";
import {isFunction} from "lodash";

type Resolver = {
    <P>(payload: P): any;
}

type Rejector = {
    <R>(reason: R): any;
}

type WrappedPromise = {
    promise: Promise<any>;
    resolve: Resolver;
    reject: Rejector;
}

const WrappedPromise = function(): WrappedPromise {
    let callbackResolve: Resolver;
    let callbackReject: Rejector;

    return {
        promise: new Promise(((resolve, reject) => {
            callbackResolve = resolve;
            callbackReject = reject;
        })),
        resolve: payload => callbackResolve && callbackResolve(payload),
        reject: reason => callbackReject && callbackReject(reason),
    };
};

const promiseDecorator = () => (next: Dispatch): Middleware => (action: any) => {
    if (isFunction(action.payload)) {
        const response = WrappedPromise();

        next({
            ...action,
            meta: {
                ...action.meta,
                response
            }
        });

        return response.promise;
    }

    return next(action);
};

export default promiseDecorator;
