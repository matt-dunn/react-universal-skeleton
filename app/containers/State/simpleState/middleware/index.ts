// - Example middleware --------------------------------------------------------------------------------------------------------------------

import {Middleware} from "../exampleStateManagement";

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

export * from "./simplePromiseDecorator";
