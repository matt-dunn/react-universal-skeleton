import simpleDeepFreeze from "simple-deep-freeze";

import updateState, { StandardAction, Options } from "./";

const frozenUpdateState = <S, P extends S>(state: S, action: StandardAction<P>, options?: Options<S, P>): Readonly<S> =>
  simpleDeepFreeze(updateState(state, action, options));

export default frozenUpdateState;

export * from "./status";
