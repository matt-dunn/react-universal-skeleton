import {Dispatch, Middleware} from "redux";
import {isFunction} from "lodash";
import isPromise from "is-promise";

import {WrappedPromise} from "components/wrappedPromise";

export const promiseDecorator = () => (next: Dispatch): Middleware => (action: any) => {
    if (isFunction(action.payload) || isPromise(action.payload)) {
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
