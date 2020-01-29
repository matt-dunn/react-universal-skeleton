import {ExampleApi, exampleApi} from "./__dummy__/example";
import {AuthApi, authApi} from "./auth";

export type API = {
    api: {
        exampleApi: ExampleApi;
        authApi: AuthApi;
    };
}

export default {
    api: {
        exampleApi,
        authApi
    }
} as API;

