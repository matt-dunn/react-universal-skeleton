type Resolver<P = any> = {
    (payload: P): any;
}

type Rejector<R = any> = {
    (reason: R): any;
}

export type WrappedPromise<P = any, R = any> = {
    promise: Promise<any>;
    resolve: Resolver<P>;
    reject: Rejector<R>;
}

export const WrappedPromise = function<P, R>(): WrappedPromise<P, R> {
    let callbackResolve: Resolver<P>;
    let callbackReject: Rejector<R>;

    return {
        promise: new Promise<P>(((resolve, reject) => {
            callbackResolve = resolve;
            callbackReject = reject;
        })),
        resolve: payload => callbackResolve && callbackResolve(payload),
        reject: reason => callbackReject && callbackReject(reason),
    };
};
