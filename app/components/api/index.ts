import {ExampleApi} from "./__dummy__/example";
import {AuthApi} from "./auth";

export const API = {
    ExampleApi,
    AuthApi
};

export type API = typeof API;

export * from "./__dummy__/example";
export * from "./auth";
