// - Example middleware --------------------------------------------------------------------------------------------------------------------

import {Middleware} from "./exampleStateManagement";

export const simplePromiseDecorator: Middleware = async (action, next) => {
    if (action.payload && action.payload.then && action.payload.catch) {
        try {
            next({
                ...action,
                payload: {
                    $status: {
                        processing: true,
                        complete: false,
                    }
                }
            });

            next({
                ...action,
                payload: {
                    ...await action.payload,
                    $status: {
                        processing: false,
                        complete: true
                    }
                }
            });
        } catch(error) {
            next({
                ...action,
                payload: {
                    $status: {
                        processing: false,
                        complete: false,
                        error: error.message
                    }
                },
                error: true
            });
        }
    } else {
        next(action);
    }
};

export const simpleAsyncDecorator: Middleware = (action, next) => {
    setTimeout(() => {
        next({
            ...action,
            meta: {
                ...action.meta,
                simpleAsyncDecorator: true
            }
        });
    }, 1000);
};

export const simpleDecorator: Middleware = (action, next) => {
    next({
        ...action,
        meta: {
            ...action.meta,
            simpleDecorator: true
        }
    });
};

