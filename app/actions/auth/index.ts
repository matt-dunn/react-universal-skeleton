import { createAction } from "typesafe-actions";

import {authApi} from "../../components/api/auth";

export interface Login {
    username: string;
    password: string;
}

const login = createAction(
    "@auth/LOGIN",
    ({username, password}: Login) => () => authApi.login(username, password)
)();

export { login };
