// import Immutable, { List, Record } from 'immutable';
import { FluxStandardAction } from "flux-standard-action";
import {getType, createReducer} from "typesafe-actions";

// import nextState from 'components/state-mutate-with-status/immutable';
import nextState, {ActionMeta} from "components/state-mutate-with-status/frozen";

import {exampleActions as actions} from "../../actions";
import {ExampleItem, ExampleList} from "../../components/api";

export type ExampleState = {
    items: ExampleList;
    item?: ExampleItem;
}

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
    [getType(actions.exampleGetList)]: exampleListReducer,
    [getType(actions.exampleEditItem)]: exampleListReducer,
    [getType(actions.exampleGetItem)]: exampleItemReducer
});
