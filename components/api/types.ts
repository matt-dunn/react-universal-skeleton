import {Request} from "express";

export type WrapWithAbortSignal<T extends (...args: any[]) => any> = {
    (...args: Parameters<T>): (signal?: AbortSignal) => ReturnType<T>;
}

export type APIContext = {
    req: Request;
};

