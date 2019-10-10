import {useCallback, useRef} from "react";

export type Options = {
    delay?: number;
};

export type Action<T> = {
    (...args: any[]): Promise<T>;
}

function useAutosave<T = any>(action: Action<T>, options?: Options): Action<T> {
    const timeout = useRef<number>();
    const isActive = useRef<boolean>(false);
    const pending = useRef<any>();

    const {delay = 500} = options || {};

    return useCallback(
        (...args): any => {
            return new Promise<T>((resolve, reject) => {
                if (!isActive.current) {
                    clearTimeout(timeout.current);

                    timeout.current = setTimeout(() => {
                        const exec = (...args: any[]) => {
                            isActive.current = true;

                            action(...args)
                                .then(payload => {
                                    if (pending.current) {
                                        exec(...pending.current)
                                        pending.current = undefined;
                                    } else {
                                        isActive.current = false;
                                        resolve(payload)
                                    }
                                })
                                .catch(reason => {
                                    pending.current = undefined;
                                    isActive.current = false;
                                    reject(reason);
                                });
                        };

                        exec(...args);
                    }, delay)
                } else {
                    pending.current = args;
                }
            })
        },
        []
    )
}

export default useAutosave;
