import {APIContext} from "components/api";

import {ExampleApi} from "./__dummy__/example";
import {AuthApi} from "./auth";

export type APIOptions = {
    ExampleApi: Parameters<ExampleApi>[0];
}

export const API = (options: APIOptions, context?: APIContext) => ({
    ExampleApi: ExampleApi(options.ExampleApi, context),
    AuthApi: AuthApi(options)
});

export type API = ReturnType<typeof API>;

export * from "./__dummy__/example";
export * from "./auth";
