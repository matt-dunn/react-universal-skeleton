import { FluxStandardAction } from 'flux-standard-action';
import { getType } from 'typesafe-actions';

import { ActionMeta } from 'components/state-mutate-with-status/state';

import nextState from 'components/state-mutate-with-status';

import {createReducer} from "components/redux/utils"

import {authActions as actions} from '../../actions';
import {IStatus} from "components/state-mutate-with-status/status";

export interface AuthenticatedUser {
    id: string;
    name: string;
    email: string;
    $status: IStatus;
}

export interface AuthState {
    authenticatedUser?: AuthenticatedUser;
}

const login = (state: AuthState, action: FluxStandardAction<string, any, ActionMeta>): AuthState => nextState(state, action, {
    path: 'authenticatedUser',
});


const initialState = {
    authenticatedUser: undefined
} as AuthState;

const authActions = {
    [getType(actions.login)]: login
};

export default createReducer(initialState, authActions);
