import immutable from 'object-path-immutable';
import { get } from 'lodash';
import { FluxStandardAction } from 'flux-standard-action';

import { IStatusTransaction, IActiveTransactions } from './status';

import { decorateStatus } from './utils';

export interface ActionMeta {
  id: string;
  $status: IStatusTransaction;
  seedPayload?: any;
}

export interface Options<T> {
  path?: string;
}

type UpdatedStatus<S, P> = {
  updatedState: S;
  originalState?: P | null;
}

const activeTransactionState = {} as IActiveTransactions<any>;

const getPayload = <S extends IStatusTransaction, P>(status: S, payload: P, seedPayload?: P): P | undefined | null => {
  if (status.isActive) {
    return status.hasError ? seedPayload : payload || seedPayload
  } else if (status.hasError) {
    return activeTransactionState[status.transactionId];
  }

  return payload
};

const getUpdatedState = <S, P, U extends IStatusTransaction>(state: S, payload: P, status: U, path: string, actionId: string): UpdatedStatus<S, P> => {
  if (actionId) {
    const array = get(state, path);

    if (Array.isArray(array)) {
      const index = array.findIndex(item => item.id === actionId);

      if (index === -1) {
        if (payload) {
          return {
            updatedState: immutable.insert(state, path, Object.assign({}, payload, {$status: decorateStatus(status)}), array.length),
            originalState: null // Ensure final payload is not set so this item can be removed from the array on failure
          }
        }
      } else if (payload === null) {
        return {
          updatedState: immutable.del(
              state,
              `${path}.${index}`,
          ) as any
        };
      } else {
        return {
          updatedState: immutable.update(
              (payload && immutable.assign(state, `${path}.${index}`, payload as any)) || state,
              `${path}.${index}.$status`,
              state => decorateStatus(status, state && state.$status)
          ) as any,
          originalState: get(state, `${path}.${index}`)
        };
      }
    } else {
      throw new TypeError(`Item in state at ${path} must be an array when meta.id (${actionId}) is specified`);
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
  const { path = '' } = options || {} as Options<P>;

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

  const $status = get(state, `${path}.$status`);

  const {updatedState , originalState} = getUpdatedState(
      state,
      getPayload(status, payload, seedPayload),
      status,
      path,
      actionId
  );

  if (status.isActive) {
    if (activeTransactionState[status.transactionId] === undefined) {
      activeTransactionState[status.transactionId] = originalState;
    }
  } else {
    delete activeTransactionState[status.transactionId];
  }

  return immutable.set(
      updatedState,
      `${path}.$status`,
      decorateStatus(status, $status)
  ) as any;
};

export default updateState;
