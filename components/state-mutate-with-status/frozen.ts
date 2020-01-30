import simpleDeepFreeze from "simple-deep-freeze";
import {FluxStandardAction} from "flux-standard-action";

import updateState, {ActionMeta, Options} from "./";

const frozenUpdateState = <S, P>(state: S, action: FluxStandardAction<string, P, ActionMeta>, options?: Options<P>): Readonly<S> =>
    simpleDeepFreeze(updateState(state, action, options));

export default frozenUpdateState;

export * from "./status";
