import immutable from "object-path-immutable";
import { get } from "lodash";
import { FluxStandardAction } from "flux-standard-action";

import { MetaStatus, ActionMeta, symbolStatus } from "./status";
import {decorateStatus, getPayload, getUpdatedState} from "./utils";

export type Path = ReadonlyArray<string>;

type GetNewItemIndex<P> = {
  (array: any[], payload: P): number;
}

export type Options<P> = {
  path?: Path;
  getNewItemIndex?: GetNewItemIndex<P>;
}

const updateState = <S, P>(state: S, { meta, error, payload }: FluxStandardAction<string, P, ActionMeta>, options?: Options<P>): S => {
  const { path = [] } = options || {} as Options<P>;

  const {
    id: actionId,
    $status: metaStatus = {
      hasError: error || false,
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

  return immutable.set(
      updatedState,
      [...path, symbolStatus as any],
      decorateStatus(metaStatus, status, isCurrent === true)
  );
};

export default updateState;

export * from "./status";
export * from "./utils";
