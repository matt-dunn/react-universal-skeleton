import { createStandardAction } from "typesafe-actions";

import {AuthApi} from "../../components/api/auth";

export interface Login {
    username: string;
    password: string;
}

const login = createStandardAction("@auth/LOGIN")
    .map(({username, password}: Login) => ({
        payload: ({ services }: {services: AuthApi}) => services.login(username, password)
    }));

export { login };
