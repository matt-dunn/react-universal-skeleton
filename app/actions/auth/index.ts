import { createAction } from "typesafe-actions";

import {ActionMeta} from "components/state-mutate-with-status";
import {WithNotification} from "components/redux/middleware/sagaNotification";

import {User} from "../../components/api";
import {APIPayloadCreator} from "../";

const login = createAction<string, APIPayloadCreator<Promise<User>>, ActionMeta<User> & WithNotification<User>>(
    "@auth/LOGIN",
    (username, password) => () => ({API: {AuthApi: {login}}}) => login(username, password)
)();

export { login };
