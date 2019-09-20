import Immutable, { List, Record } from 'immutable';
import { FluxStandardAction } from 'flux-standard-action';
import { Reducer } from "redux";
import { ActionType, getType } from 'typesafe-actions';

import { IActionMeta } from '../../components/state-mutate-with-status/state';
import nextState from '../../components/state-mutate-with-status/immutable';
import { IStatus } from '../../components/state-mutate-with-status/status';

interface IReducer<T> {
    (state: T, action: FluxStandardAction<string, any, any>): T;
}

interface IReducers<T> {
    [key: string]: IReducer<T>;
}

const combineReducers = <T>(initialState: T, ...reducers: IReducers<T>[]): Reducer<T> => {
    const allReducers: IReducers<T> = Object.assign({}, ...reducers);

    return (state: T = initialState, action: FluxStandardAction<string, any, any>): T => {
        const reducer = allReducers[action.type];

        return (reducer && reducer(state, action)) || state;
    };
};



import * as actions from '../../actions';

export interface IExampleItemState extends Record<{
    id: string;
    name: string;
    $status: IStatus;
}>{}

export interface IExampleListState extends List<IExampleItemState>{}

export interface IExampleState extends Record<{
    items: IExampleListState;
    item: IExampleItemState;
    $status: IStatus;
}>{}

const example = (state: IExampleState, action: FluxStandardAction<string, any, IActionMeta>): IExampleState => nextState(state, action, {
    path: 'item'
});

const exampleList = (state: IExampleState, action: FluxStandardAction<string, any, IActionMeta>): IExampleState => nextState(state, action, {
    path: 'items',
    addItem: (items: IExampleListState, item: IExampleItemState) => items.splice(0, 0, item),
});

const initialState = Immutable.fromJS({
    item: {
        id: '0',
        name: 'Item 0',
    },
    items: [
        {
            id: '1',
            name: 'Item 1',
        },
        {
            id: '2',
            name: 'Item 2',
        },
        {
            id: '3',
            name: 'Item 3',
        },
    ],
}) as IExampleState;

const exampleActions = {
    [getType(actions.exampleActions.example)]: example,
    [getType(actions.exampleActions.exampleList)]: exampleList,
};

export default combineReducers(initialState, exampleActions);
