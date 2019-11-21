import {useCallback, useRef} from "react";

export type Options = {
    delay?: number;
    onSaving?: (...args: any[]) => void;
    onComplete?: (...args: any[]) => void;
};

export type Action<T> = {
    (...args: any[]): Promise<T>;
}

function useAutosave<T = any>(action?: Action<T>, options?: Options): Action<T> {
    const timeout = useRef<number>();
    const isActive = useRef<boolean>(false);
    const pending = useRef<any>();

    const {delay = 500, onSaving, onComplete} = options || {};

    return useCallback(
        (...args): Promise<T> => {
            if (!action) {
                return Promise.reject(new Error("No action defined"));
            }

            return new Promise<T>((resolve, reject) => {
                if (!isActive.current) {
                    clearTimeout(timeout.current);

                    timeout.current = setTimeout(() => {
                        const exec = (...args: any[]) => {
                            isActive.current = true;
                            onSaving && onSaving(...args);

                            action(...args)
                                .then(payload => {
                                    if (pending.current) {
                                        exec(...pending.current);
                                        pending.current = undefined;
                                    } else {
                                        isActive.current = false;
                                        onComplete && onComplete(...args);
                                        resolve(payload);
                                    }
                                })
                                .catch(reason => {
                                    pending.current = undefined;
                                    isActive.current = false;
                                    onComplete && onComplete(...args);
                                    reject(reason);
                                });
                        };

                        exec(...args);
                    }, delay);
                } else {
                    pending.current = args;
                }
            });
        },
        [action, delay, onComplete, onSaving]
    );
}

export default useAutosave;
