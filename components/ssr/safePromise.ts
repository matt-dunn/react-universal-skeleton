import React, {ReactElement, useContext, useEffect, useState} from "react";
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

export const useSafePromise = <T, D = any>(id: string): [SafePromise<T>, () => D | undefined] => {
    const asyncContext = useContext(AsyncContext);
    const asyncDataContext = useContext(AsyncDataContext);

    return [
        (promise: Promise<T>) => {
            asyncContext && asyncContext.push(promise);

            promise.then(payload => {
                if (asyncDataContext) {
                    asyncDataContext.data[id] = (payload);
                }
            });

            return promise;
        },
        () => asyncDataContext && asyncDataContext.data[id]
    ]
};

export const useAsync = <T>(id: string, getPayload: () => Promise<T>, processOnClient = false) => {
    const [safePromise, getData] = useSafePromise<T>(id);
    const [payload, setPayload] = useState<T>(getData());

    if (!(process as any).browser && !payload) {
        safePromise(getPayload());
    }

    useEffect(() => {
        if (!payload || processOnClient) {
            getPayload().then(payload => setPayload(payload));
        }
    }, [getPayload, payload, processOnClient, setPayload]);

    return [payload];
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
    data: any = {};

    constructor(data?: any[]) {
        if (data) {
            this.data = data;
        }
    }
}
