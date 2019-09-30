import {ActionType} from "typesafe-actions";

import * as exampleActions from "./__dummy__/example";
import * as authActions from "./auth";

export type RootActions = ActionType<typeof import('../actions')>;

export { exampleActions, authActions };
