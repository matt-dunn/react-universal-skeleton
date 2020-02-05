import { FluxStandardAction } from "flux-standard-action";
import { getType, createReducer } from "typesafe-actions";

import nextState, {ActionMeta, DecoratedWithStatus} from "components/state-mutate-with-status";

import {authActions as actions} from "../../actions";
import {User} from "../../components/api/auth";

export type AuthState = {
    authenticatedUser?: User & DecoratedWithStatus;
}

const login = (state: AuthState, action: FluxStandardAction<string, any, ActionMeta>): AuthState => nextState(state, action, {
    path: ["authenticatedUser"],
});

const initialState = {
    authenticatedUser: undefined
} as AuthState;

export default createReducer(initialState, {
    [getType(actions.login)]: login
});
