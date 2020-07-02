import { wrap } from "object-path-immutable";
import { get, isFunction } from "lodash";
import isPromise from "is-promise";

import { MetaStatus, ActionMeta, symbolStatus } from "./status";
import { decorateStatus, getPayload, getUpdatedState } from "./utils";

export type StandardAction<P = any, M extends ActionMeta = ActionMeta> = {
  readonly type: string;
  readonly payload?: P;
  readonly meta?: M;
  readonly error?: boolean;
};

export type Path = ReadonlyArray<string>;

export type GetPath<S, P> = (state: S, payload: P | undefined, meta: StandardAction<P>["meta"] | undefined) => ReadonlyArray<string> | null;

type GetNewItemIndex<P> = {
  (array: any[], payload: P): number;
}

export type Options<S, P> = {
  readonly path?: Path | GetPath<S, P>;
  readonly getNewItemIndex?: GetNewItemIndex<P>;
  readonly autoInsert?: boolean;
  readonly autoDelete?: boolean;
  readonly appendArray?: boolean;
  readonly appendArrayPath?: string;
}

const updateState = <S, P extends S>(state: S, { meta, error, payload }: StandardAction<P>, options?: Options<S, P>): S => {
  if (isPromise(payload)) {
    return state;
  }

  const { path = [] } = options || {} as Options<S, P>;

  const {
    id: actionId,
    $status: metaStatus = {
      error: error && payload,
      processing: false,
      complete: false
    } as MetaStatus,
  } = meta || {} as ActionMeta;

  const updatePath = isFunction(path) ? path(state, payload, meta) : path;

  if (!updatePath) {
    return state;
  }

  const status = get(state, [...updatePath, symbolStatus]);

  const { updatedState, isCurrent } = getUpdatedState(
    state,
    getPayload(metaStatus, payload),
    metaStatus,
    updatePath,
    actionId,
    options
  );

  return wrap(updatedState).set(
    [...updatePath, symbolStatus as any],
    decorateStatus(metaStatus, status, isCurrent === true)
  ).value();
};

export default updateState;

export * from "./status";
export * from "./utils";
