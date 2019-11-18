import React, {ReactElement, useContext} from "react";
import { renderToStaticMarkup } from 'react-dom/server'

import {AsyncContext, AsyncDataContext} from "./contexts";

type SafePromise<T = any> = {
    (promise: Promise<T>): Promise<T>;
}

export const getDataFromTree = (app: ReactElement) => {
    const asyncContext: Promise<any>[] = [];

    const html = renderToStaticMarkup(
        React.createElement(
            AsyncContext.Provider,
            {value: asyncContext},
            app
        )
    );

    return Promise.all(asyncContext)
        .then(() => html)
        .catch(ex => console.error(ex)) // Swallow exceptions - they should be handled by the app...
};

export const useSafePromise = <T, D = any>(): [SafePromise<T>, () => D] => {
    const asyncContext = useContext(AsyncContext);
    const asyncDataContext = useContext(AsyncDataContext);

    return [(promise: Promise<T>) => {
        asyncContext && asyncContext.push(promise);

        promise.then(payload => {
            if (asyncDataContext) {
                asyncDataContext.data.push(payload);
            }
        });

        return promise;
    }, () => asyncDataContext && asyncDataContext.data[asyncDataContext.counter++]]
};

export const useSafePromiseWithEffect = <T>(): SafePromise<T> | undefined => {
    const asyncContext = useContext(AsyncContext);

    if (asyncContext) {
        return (promise: Promise<T>) => {
            asyncContext.push(promise);

            return promise;
        }
    }
};

export const AsyncDataContextProvider = AsyncDataContext.Provider;

export class AsyncData implements AsyncDataContext {
    counter = 0;
    data: any[] = [];

    constructor(data?: any[]) {
        if (data) {
            this.data = data;
        }
    }
}
