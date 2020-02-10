type Callback = {
    (): void;
}

export type Cancel = (cb: Callback) => Callback

type Cancelable = {
    canceller: Cancel;
    cancel: () => void;
}

export const Cancellable = function(): Cancelable {
    let callback: Callback;
    let isCancelled = false;

    return {
        canceller: (cb: Callback) => {
            isCancelled && cb();
            return callback = cb;
        },
        cancel: () => {
            isCancelled = true;
            callback && callback();
        }
    };
};

export type WrapCancelable<T extends (...args: any[]) => any> = {
    (...args: Parameters<T>): (cancel?: Cancel) => ReturnType<T>;
}

