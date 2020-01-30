import {Dispatch, Middleware} from "redux";
import {isFunction} from "lodash";

import {WrappedPromise} from "components/wrappedPromise";

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
