import { FluxStandardAction } from 'flux-standard-action';
import { getType } from 'typesafe-actions';

import { IActionMeta } from '../../components/state-mutate-with-status/state';

import nextState from '../../components/state-mutate-with-status';

import {combineReducers} from "../combineReducers"

import {authActions as actions} from '../../actions';
import {IStatus} from "../../components/state-mutate-with-status/status";

export interface AuthenticatedUser {
    id: string;
    name: string;
    $status: IStatus;
}

export interface AuthState {
    authenticatedUser?: AuthenticatedUser;
}

const login = (state: AuthState, action: FluxStandardAction<string, any, IActionMeta>): AuthState => nextState(state, action, {
    path: 'authenticatedUser',
});


const initialState = {
    authenticatedUser: undefined
} as AuthState;

const authActions = {
    [getType(actions.login)]: login
};

export default combineReducers(initialState, authActions);
