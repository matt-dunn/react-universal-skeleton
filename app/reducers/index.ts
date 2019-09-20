import { combineReducers } from 'redux';

import example, {IExampleState} from "./__dummy__/example";

export interface IAppState {
    example: IExampleState;
}

export default combineReducers<IAppState>({
    example
});
