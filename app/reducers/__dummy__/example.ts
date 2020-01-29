// import Immutable, { List, Record } from 'immutable';
import { FluxStandardAction } from "flux-standard-action";
import {getType, createReducer} from "typesafe-actions";

import { ActionMeta } from "components/state-mutate-with-status";
// import nextState from 'components/state-mutate-with-status/immutable';
import nextState from "components/state-mutate-with-status/frozen";

import {exampleActions as actions} from "../../actions";

// export interface ExampleItemState extends Record<{
export interface ExampleItemState {
    id: string;
    name: string;
}

// export interface ExampleListState extends List<ExampleItemState>{}

// export interface ExampleState extends Record<{
export interface ExampleState {
    items: ExampleItemState[];
    item?: ExampleItemState;
}

const exampleGetList = (state: ExampleState, action: FluxStandardAction<string, any, ActionMeta>): ExampleState => nextState(state, action, {
    path: ["items"],
});

const exampleGetItem = (state: ExampleState, action: FluxStandardAction<string, any, ActionMeta>): ExampleState => nextState(state, action, {
    path: ["item"],
});

const exampleEditItem = (state: ExampleState, action: FluxStandardAction<string, any, ActionMeta>): ExampleState => nextState(state, action, {
    path: ["items"],
});

const initialState = {
    item: undefined,
    items: [],
} as ExampleState;

export default createReducer(initialState, {
    [getType(actions.exampleGetList)]: exampleGetList,
    [getType(actions.exampleGetItem)]: exampleGetItem,
    [getType(actions.exampleEditItem)]: exampleEditItem,
});
