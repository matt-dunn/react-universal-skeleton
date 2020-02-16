export type WrapWithAbortSignal<T extends (...args: any[]) => any> = {
    (...args: Parameters<T>): (signal?: AbortSignal) => ReturnType<T>;
}
