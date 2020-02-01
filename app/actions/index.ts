import {ActionType} from "typesafe-actions";

import * as exampleActions from "./__dummy__/example";
import * as authActions from "./auth";

import {notifyAction} from "components/redux/middleware/sagaNotification";

export type RootActions = ActionType<typeof exampleActions | typeof authActions | typeof notifyAction>;

export { exampleActions, authActions };
