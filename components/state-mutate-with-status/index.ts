import {wrap} from "object-path-immutable";
import { get } from "lodash";

import { MetaStatus, ActionMeta, symbolStatus } from "./status";
import {decorateStatus, getPayload, getUpdatedState} from "./utils";

export type StandardAction<P = any, M extends ActionMeta = ActionMeta> = {
  type: string;
  payload?: P;
  meta?: M;
  error?: boolean;
};

export type Path = ReadonlyArray<string>;

type GetNewItemIndex<P> = {
  (array: any[], payload: P): number;
}

export type Options<P> = {
  path?: Path;
  getNewItemIndex?: GetNewItemIndex<P>;
  autoInsert?: boolean;
  autoDelete?: boolean;
}

const updateState = <S, P extends S>(state: S, { meta, error, payload }: StandardAction<P>, options?: Options<P>): S => {
  const { path = [] } = options || {} as Options<P>;

  const {
    id: actionId,
    $status: metaStatus = {
      error: error && payload,
      complete: false,
      processing: false
    } as MetaStatus,
  } = meta || {} as ActionMeta;

  const status = get(state, [...path, symbolStatus]);

  const {updatedState, isCurrent} = getUpdatedState(
      state,
      getPayload(metaStatus, payload),
      metaStatus,
      path,
      actionId,
      options
  );

  return wrap(updatedState).set(
      [...path, symbolStatus as any],
      decorateStatus(metaStatus, status, isCurrent === true)
  ).value();
};

export default updateState;

export * from "./status";
export * from "./utils";
