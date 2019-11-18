import React, {ReactElement, useContext} from "react";
import { renderToStaticMarkup } from 'react-dom/server'

import {AsyncContext} from "./contexts";

type SafePromise<T = any> = {
    (promise: Promise<T>): Promise<T>
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

export const useSafePromise = <T>(): SafePromise<T> => {
    const asyncContext = useContext(AsyncContext);

    return (promise: Promise<T>) => {
        asyncContext && asyncContext.push(promise);

        return promise;
    }
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
