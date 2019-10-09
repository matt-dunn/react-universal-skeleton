// import Immutable, { List, Record } from 'immutable';
import { FluxStandardAction } from 'flux-standard-action';
import { getType } from 'typesafe-actions';

import { ActionMeta } from 'components/state-mutate-with-status';
// import nextState from 'components/state-mutate-with-status/immutable';
import nextState from 'components/state-mutate-with-status/frozen';
import { IStatus } from 'components/state-mutate-with-status/status';

import {createReducer} from "components/redux/utils"

import {exampleActions as actions} from '../../actions';

// export interface IExampleItemState extends Record<{
export interface IExampleItemState {
    id: string;
    name: string;
    $status: IStatus;
}

// export interface IExampleListState extends List<IExampleItemState>{}

// export interface IExampleState extends Record<{
export interface IExampleState {
    items: IExampleItemState[];
    item?: IExampleItemState;
    $status?: IStatus;
}

const exampleGetList = (state: IExampleState, action: FluxStandardAction<string, any, ActionMeta>): IExampleState => nextState(state, action, {
    path: ['items'],
});

const exampleGetItem = (state: IExampleState, action: FluxStandardAction<string, any, ActionMeta>): IExampleState => nextState(state, action, {
    path: ['item'],
});

const exampleEditItem = (state: IExampleState, action: FluxStandardAction<string, any, ActionMeta>): IExampleState => nextState(state, action, {
    path: ['items'],
});

const initialState = {
    item: undefined,
    items: [] as Array<IExampleItemState>,
} as IExampleState;

const exampleActions = {
    [getType(actions.exampleGetList)]: exampleGetList,
    [getType(actions.exampleGetItem)]: exampleGetItem,
    [getType(actions.exampleEditItem)]: exampleEditItem,
};

export default createReducer(initialState, exampleActions);
