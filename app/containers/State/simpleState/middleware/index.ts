// - Example middleware --------------------------------------------------------------------------------------------------------------------

import {Middleware} from "../getStore";

export const logger: Middleware = () => next => action => {
    console.log(`%c${logger.name}`, "color:#000;background-color:orange;padding: 2px 4px;border-radius:1em;", action);
    next(action);
};

export const simpleAsyncDecorator: Middleware = () => next => action => {
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

export const simpleDecorator: Middleware = () => next => action => {
    next({
        ...action,
        meta: {
            ...action.meta,
            simpleDecorator: true
        }
    });
};

export * from "./simplePromiseDecorator";
