import {ActionType} from "typesafe-actions";

import * as exampleActions from "./__dummy__/example";

export type RootActions = ActionType<typeof import('../actions')>;

export { exampleActions };
