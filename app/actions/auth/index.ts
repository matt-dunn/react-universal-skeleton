import { createAction } from "typesafe-actions";

import {AuthApi} from "../../components/api/auth";

export interface Login {
    username: string;
    password: string;
}

const login = createAction(
    "@auth/LOGIN",
    ({username, password}: Login) => ({ services }: {services: AuthApi}) => services.login(username, password)
)();

export { login };
