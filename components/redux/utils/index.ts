import {FluxStandardAction} from "flux-standard-action";
import {Reducer} from "redux";

interface CreateReducer<T> {
    (state: T, action: FluxStandardAction<string, any, any>): T;
}

interface CreateReducers<T> {
    [key: string]: CreateReducer<T>;
}

export const createReducer = <T>(initialState: T, ...reducers: CreateReducers<T>[]): Reducer<T> => {
    const allReducers: CreateReducers<T> = Object.assign({}, ...reducers);

    return (state: T = initialState, action: FluxStandardAction<string, any, any>): T => {
        const reducer = allReducers[action.type];

        return (reducer && reducer(state, action)) || state;
    };
};
