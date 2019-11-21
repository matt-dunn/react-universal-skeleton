import { combineReducers } from "redux";

import example, {ExampleState} from "./__dummy__/example";
import auth, {AuthState} from "./auth";

export interface AppState {
    example: ExampleState;
    auth: AuthState;
}

export default combineReducers<AppState>({
    example,
    auth
});
