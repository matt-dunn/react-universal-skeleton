// import Immutable, { List, Record } from 'immutable';
import { FluxStandardAction } from "flux-standard-action";
import {getType, createReducer} from "typesafe-actions";

// import nextState from 'components/state-mutate-with-status/immutable';
import nextState, {ActionMeta} from "components/state-mutate-with-status/frozen";

import {exampleActions as actions} from "../../actions";
import {ExampleItem, ExampleList, Kitten} from "../../components/api";

export type ExampleState = {
    items: ExampleList;
    item?: ExampleItem;
    kitten?: Kitten;
}

const exampleDBItemReducer = (state: ExampleState, action: FluxStandardAction<string, any, ActionMeta>): ExampleState => nextState(state, action, {
    path: ["kitten"]
});

const exampleListReducer = (state: ExampleState, action: FluxStandardAction<string, any, ActionMeta>): ExampleState => nextState(state, action, {
    path: ["items"]
});

const exampleItemReducer = (state: ExampleState, action: FluxStandardAction<string, any, ActionMeta>): ExampleState => nextState(state, action, {
    path: ["item"],
});

const initialState = {
    item: undefined,
    items: [],
} as ExampleState;

export default createReducer(initialState, {
    [getType(actions.exampleGetDBItem)]: exampleDBItemReducer,
    [getType(actions.exampleSaveDBItem)]: exampleDBItemReducer,
    [getType(actions.exampleUpdateDBItem)]: exampleDBItemReducer,
    [getType(actions.exampleGetList)]: exampleListReducer,
    [getType(actions.exampleEditItem)]: exampleListReducer,
    [getType(actions.exampleGetItem)]: exampleItemReducer
});
