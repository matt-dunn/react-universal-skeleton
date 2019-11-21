// import Immutable, { List, Record } from 'immutable';
import { FluxStandardAction } from "flux-standard-action";
import { getType } from "typesafe-actions";

import { ActionMeta } from "components/state-mutate-with-status";
// import nextState from 'components/state-mutate-with-status/immutable';
import nextState from "components/state-mutate-with-status/frozen";
import { IStatus } from "components/state-mutate-with-status/status";

import {createReducer} from "components/redux/utils";

import {exampleActions as actions} from "../../actions";

// export interface ExampleItemState extends Record<{
export interface ExampleItemState {
    id: string;
    name: string;
    $status: IStatus;
}

// export interface ExampleListState extends List<ExampleItemState>{}

// export interface ExampleState extends Record<{
export interface ExampleState {
    items: ExampleItemState[];
    item?: ExampleItemState;
    $status?: IStatus;
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
    items: [] as Array<ExampleItemState>,
} as ExampleState;

const exampleActions = {
    [getType(actions.exampleGetList)]: exampleGetList,
    [getType(actions.exampleGetItem)]: exampleGetItem,
    [getType(actions.exampleEditItem)]: exampleEditItem,
};

export default createReducer(initialState, exampleActions);
