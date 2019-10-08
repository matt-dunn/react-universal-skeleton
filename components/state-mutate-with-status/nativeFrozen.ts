import simpleDeepFreeze from 'simple-deep-freeze';
import {FluxStandardAction} from "flux-standard-action";
import {ActionMeta, Options} from "./state";

import updateState from "./native";

const frozenUpdateState = <T, U>(state: T, action: FluxStandardAction<string, U, ActionMeta>, options?: Options<U>): Readonly<T> =>
    simpleDeepFreeze(updateState(state, action, options));

export default frozenUpdateState;
