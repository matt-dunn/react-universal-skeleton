import simpleDeepFreeze from 'simple-deep-freeze';
import {FluxStandardAction} from "flux-standard-action";
import {ActionMeta, Options} from "./index";

import updateState from "./index";

const frozenUpdateState = <S, P>(state: S, action: FluxStandardAction<string, P, ActionMeta>, options?: Options): Readonly<S> =>
    simpleDeepFreeze(updateState(state, action, options));

export default frozenUpdateState;
