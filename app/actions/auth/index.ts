import { createAction } from "typesafe-actions";

import {API} from "../../components/api";

export interface Login {
    username: string;
    password: string;
}

const login = createAction(
    "@auth/LOGIN",
    ({username, password}) => () => ({api: {authApi: {login}}}: API) => login(username, password)
)();

export { login };
