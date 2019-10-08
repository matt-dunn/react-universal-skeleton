import simpleDeepFreeze from 'simple-deep-freeze';
import {FluxStandardAction} from "flux-standard-action";
import {ActionMeta, Options} from "./index";

import updateState from "./index";

const frozenUpdateState = <T, U>(state: T, action: FluxStandardAction<string, U, ActionMeta>, options?: Options<U>): Readonly<T> =>
    simpleDeepFreeze(updateState(state, action, options));

export default frozenUpdateState;
