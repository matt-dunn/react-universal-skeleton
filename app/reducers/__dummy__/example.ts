// import Immutable, { List, Record } from 'immutable';
import { FluxStandardAction } from 'flux-standard-action';
import { Reducer } from "redux";
import { getType } from 'typesafe-actions';

import { IActionMeta } from '../../components/state-mutate-with-status/state';
// import nextState from '../../components/state-mutate-with-status/immutable';
import nextState from '../../components/state-mutate-with-status';
import { IStatus } from '../../components/state-mutate-with-status/status';

import {combineReducers} from "../combineReducers"

import {exampleActions as actions} from '../../actions';

// export interface IExampleItemState extends Record<{
export interface IExampleItemState {
    id: string;
    name: string;
    $status: IStatus;
}

// export interface IExampleListState extends List<IExampleItemState>{}

export interface IExampleListState extends Array<IExampleItemState>{}

// export interface IExampleState extends Record<{
export interface IExampleState {
    items: IExampleListState;
    item?: IExampleItemState;
    $status?: IStatus;
}

const exampleGetList = (state: IExampleState, action: FluxStandardAction<string, any, IActionMeta>): IExampleState => nextState(state, action, {
    path: 'items',
});

const exampleGetItem = (state: IExampleState, action: FluxStandardAction<string, any, IActionMeta>): IExampleState => nextState(state, action, {
    path: 'item',
});

// const example = (state: IExampleState, action: FluxStandardAction<string, any, IActionMeta>): IExampleState => nextState(state, action, {
//     path: 'item'
// });
//
// const exampleList = (state: IExampleState, action: FluxStandardAction<string, any, IActionMeta>): IExampleState => nextState(state, action, {
//     path: 'items',
//     addItem: (items: IExampleListState, item: IExampleItemState) => items.splice(0, 0, item),
// });

const initialState = {
    item: undefined,
    items: [] as Array<IExampleItemState>,
} as IExampleState;

const exampleActions = {
    [getType(actions.exampleGetList)]: exampleGetList,
    [getType(actions.exampleGetItem)]: exampleGetItem,
    // [getType(actions.exampleActions.example)]: example,
    // [getType(actions.exampleActions.exampleList)]: exampleList,
};

export default combineReducers(initialState, exampleActions);
