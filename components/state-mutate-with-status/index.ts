import immutable from "object-path-immutable";
import { get } from "lodash";
import { FluxStandardAction } from "flux-standard-action";

import { StatusTransaction } from "./status";
import {setPendingState} from "./pendingTransactionState";
import {decorateStatus, getPayload, getUpdatedState} from "./utils";

export type Path = ReadonlyArray<string>;

export interface ActionMeta {
  id?: string;
  $status: StatusTransaction;
  seedPayload?: any;
}

export interface GetNewItemIndex<P> {
  (array: any[], payload: P): number;
}

export interface Options<P> {
  path?: Path;
  getNewItemIndex?: GetNewItemIndex<P>;
}

const updateState = <S, P>(state: S, { meta, error, payload }: FluxStandardAction<string, P, ActionMeta>, options?: Options<P>): S => {
  const { path = [] } = options || {} as Options<P>;

  const {
    id: actionId,
    seedPayload,
    $status: status = {
      hasError: error || false,
      error: error && payload,
      complete: true,
      processing: false
    } as unknown as StatusTransaction,
  } = meta || {} as ActionMeta;

  const $status = get(state, [...path, "$status"]);

  const {updatedState , originalState, isCurrent} = getUpdatedState(
      state,
      getPayload(status, payload, seedPayload),
      status,
      path,
      actionId,
      options
  );

  setPendingState(status, originalState);

  return immutable.set(
      updatedState,
      [...path, "$status"],
      decorateStatus(status, $status, isCurrent === true)
  );
};

export default updateState;
