import { combineReducers } from 'redux';

import example, {IExampleState} from "./__dummy__/example";
import auth, {AuthState} from "./auth";

export interface IAppState {
    example: IExampleState;
    auth: AuthState;
}

export default combineReducers<IAppState>({
    example,
    auth
});
