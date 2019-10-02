import simpleDeepFreeze from 'simple-deep-freeze';
import {FluxStandardAction} from "flux-standard-action";
import {IActionMeta, IOptions} from "./state";

import updateState from "./native";

const frozenUpdateState = <T, U>(state: T, action: FluxStandardAction<string, U, IActionMeta>, options?: IOptions<U>): Readonly<T> =>
    simpleDeepFreeze(updateState(state, action, options));

export default frozenUpdateState;
