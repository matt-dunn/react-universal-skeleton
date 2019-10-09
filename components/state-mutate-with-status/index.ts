import immutable from 'object-path-immutable';
import { get } from 'lodash';
import { FluxStandardAction } from 'flux-standard-action';

import { IStatusTransaction } from './status';

import {getPendingState, setPendingState} from "./pendingTransactionState";

import { decorateStatus } from './utils';

export type Path = ReadonlyArray<string>;

export interface ActionMeta {
  id?: string;
  $status: IStatusTransaction;
  seedPayload?: any;
}

export interface GetNewItemIndex<P> {
  (array: any[], payload: P): number;
}

export interface Options<P> {
  path?: Path;
  getNewItemIndex?: GetNewItemIndex<P>;
}

type UpdatedStatus<S, P> = {
  updatedState: S;
  originalState?: P | null;
}

const getPayload = <S extends IStatusTransaction, P>(status: S, payload: P, seedPayload?: P): P | undefined | null => {
  if (status.isActive) {
    return status.hasError ? seedPayload : payload || seedPayload
  } else if (status.hasError) {
    return getPendingState(status.transactionId);
  }

  return status.complete ? payload : seedPayload
};

const getUpdatedState = <S, P, U extends IStatusTransaction>(state: S, payload: P, status: U, path: Path, actionId?: string, options?: Options<P>): UpdatedStatus<S, P> => {
  if (actionId) {
    const array = get(state, path);

    if (Array.isArray(array)) {
      const index = array.findIndex(item => item.id === actionId);

      if (index === -1) {
        if (payload) {
          const { getNewItemIndex } = options || {} as Options<P>;

          return {
            updatedState: immutable.insert(state, path, Object.assign({}, payload, {$status: decorateStatus(status)}), getNewItemIndex ? getNewItemIndex(array, payload) : array.length),
            originalState: null // Ensure final payload is not set so this item can be removed from the array on failure
          }
        }
      } else if (payload === null) {
        return {
          updatedState: immutable.del(
              state,
              [...path, index.toString()]
          ) as any
        };
      } else {
        return {
          updatedState: immutable.update(
              (payload && immutable.assign(state, [...path, index.toString()], payload as any)) || state,
              [...path, index.toString(), '$status'],
              state => decorateStatus(status, state && state.$status)
          ) as any,
          originalState: get(state, [...path, index.toString()])
        };
      }
    } else {
      throw new TypeError(`Item in state at ${path.join('.')} must be an array when meta.id (${actionId}) is specified`);
    }

    return {
      updatedState: state
    };
  } else {
    return {
      updatedState: (payload && immutable.assign(state, path, payload as any)) || state,
      originalState: get(state, path)
    };
  }
};

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
    } as unknown as IStatusTransaction,
  } = meta || {} as ActionMeta;

  const $status = get(state, [...path, '$status']);

  const {updatedState , originalState} = getUpdatedState(
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
      [...path, '$status'],
      decorateStatus(status, $status)
  ) as any;
};

export default updateState;
