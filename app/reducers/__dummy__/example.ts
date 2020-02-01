// import Immutable, { List, Record } from 'immutable';
import { FluxStandardAction } from "flux-standard-action";
import {getType, createReducer} from "typesafe-actions";

// import nextState from 'components/state-mutate-with-status/immutable';
import nextState, {ActionMeta} from "components/state-mutate-with-status/frozen";

import {exampleActions as actions} from "../../actions";

// export interface ExampleItemState extends Record<{
export type ExampleItemState = {
    id: string;
    name: string;
}

export type ExampleItemsState = ExampleItemState[];

// export interface ExampleListState extends List<ExampleItemState>{}

// export interface ExampleState extends Record<{
export type ExampleState = {
    items: ExampleItemsState;
    item?: ExampleItemState;
}

const exampleListReducer = (state: ExampleState, action: FluxStandardAction<string, any, ActionMeta>): ExampleState => nextState(state, action, {
    path: ["items"],
});

const exampleItemReducer = (state: ExampleState, action: FluxStandardAction<string, any, ActionMeta>): ExampleState => nextState(state, action, {
    path: ["item"],
});

const initialState = {
    item: undefined,
    items: [],
} as ExampleState;

export default createReducer(initialState, {
    [getType(actions.exampleGetList)]: exampleListReducer,
    [getType(actions.exampleEditItem)]: exampleListReducer,
    [getType(actions.exampleGetItem)]: exampleItemReducer
});
