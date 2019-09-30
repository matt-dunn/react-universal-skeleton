import {FluxStandardAction} from "flux-standard-action";
import {Reducer} from "redux";

interface IReducer<T> {
    (state: T, action: FluxStandardAction<string, any, any>): T;
}

interface IReducers<T> {
    [key: string]: IReducer<T>;
}

export const combineReducers = <T>(initialState: T, ...reducers: IReducers<T>[]): Reducer<T> => {
    const allReducers: IReducers<T> = Object.assign({}, ...reducers);

    return (state: T = initialState, action: FluxStandardAction<string, any, any>): T => {
        const reducer = allReducers[action.type];

        return (reducer && reducer(state, action)) || state;
    };
};
