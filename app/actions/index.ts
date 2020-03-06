import {PayloadCreator} from "components/redux/middleware/sagaAsyncAction";

import {API} from "../components/api";

import * as exampleActions from "./__dummy__/example";
import * as authActions from "./auth";

export type APIPayloadCreator<P> = PayloadCreator<[{API: API}], P>;

export type RootActions = typeof import("../actions");

export { exampleActions, authActions };
