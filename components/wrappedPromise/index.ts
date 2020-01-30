type Resolver = {
    <P>(payload: P): any;
}

type Rejector = {
    <R>(reason: R): any;
}

export type WrappedPromise = {
    promise: Promise<any>;
    resolve: Resolver;
    reject: Rejector;
}

export const WrappedPromise = function(): WrappedPromise {
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
