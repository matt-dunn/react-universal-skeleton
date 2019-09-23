import isPromise from 'is-promise';
import { FluxStandardAction } from 'flux-standard-action';

import { IStatusTransaction, IActiveTransactions } from './status';
import { decorateStatus, getUpdatePath, findIndex, parsePath } from './utils';

interface GetValueByPath {
  (state: any, path: string): any;
}

interface ConvertObject {
  (state: any): any;
}

interface IsArray {
  (state: any): boolean;
}

interface UpdateNewItem {
  (state: any, path: string, updatePath: string, item: any, $status: IStatusTransaction, addItem?: Function): any;
}

interface DeleteItem {
  (state: any, path: string): any;
}

interface UpdateItem {
  (state: any, updatePath: string, item: any, $status: IStatusTransaction): any;
}

export interface IUpdateState {
  getValueByPath: GetValueByPath;
  convertObject: ConvertObject;
  isArray: IsArray;
  updateNewItem: UpdateNewItem;
  deleteItem: DeleteItem;
  updateItem: UpdateItem;
}

export interface IPayload<U> {
  (payload: U, actionId: string, meta: any): any;
}

export interface ITransformState<T = any, U = any> {
  (state: T, payload: U, meta: any): U;
}

export interface IAddItem {
  (parent: any, obj: any): any;
}

export interface IActionMeta {
  id: string;
  $status: IStatusTransaction;
  seedPayload?: any;
}

export interface IOptions<T> {
  transformPayload?: IPayload<T>;
  transformState?: ITransformState;
  path?: string;
  addItem?: IAddItem;
  useSeed?: boolean;
}

const activeTransactionState = {} as IActiveTransactions<any>;

const updateState = ({
 getValueByPath, convertObject, isArray, updateNewItem, deleteItem, updateItem,
}: IUpdateState) => <T, U>(state: T, { meta, error, payload = {} as U }: FluxStandardAction<string, U, IActionMeta>, options?: IOptions<U>): T => {
  const { transformPayload, transformState, path = '', addItem, useSeed = true } = options || {} as IOptions<U>;
  const {
    id: actionId,
    seedPayload,
    $status = {
      hasError: error || false,
      error: error && payload,
      complete: true,
      processing: false
    } as IStatusTransaction,
  } = meta || {} as IActionMeta;

  const update = getValueByPath(state, path);
  const updatePath = getUpdatePath(isArray, update, actionId, path);

  if (seedPayload && $status.transactionId && !activeTransactionState[$status.transactionId]) {
    activeTransactionState[$status.transactionId] = getValueByPath(state, updatePath);
  }

  if ($status.complete && !error) {
    if (payload && isPromise(payload)) {
      throw new Error('Promise returned as action payload; middleware not configured or action is not a valid FSA');
    }

    delete activeTransactionState[$status.transactionId];

    const done = () => {
      const nextPayload = transformPayload ? transformPayload(payload, actionId, meta) : payload;

      if (update && typeof update !== 'object') {
        return convertObject(nextPayload);
      }

      if (actionId && isArray(update) && findIndex(update, actionId) === -1) {
        if (nextPayload) {
          return updateNewItem(state, path, updatePath, convertObject(nextPayload), $status, addItem);
        }
      } else {
        if (isArray(update) && !nextPayload) {
          return deleteItem(state, updatePath);
        }

        if (!update) {
          return updateNewItem(state, path, updatePath, convertObject(nextPayload), $status);
        }

        return updateItem(
            (isArray(update) && updateItem(state, getUpdatePath(isArray, update, '', path), convertObject(nextPayload), $status)) || state,
            (actionId && updatePath) || path,
            convertObject(nextPayload),
            $status
        );
      }
    };

    const updatedState = done();

    if (transformState) {
      return updateItem(state, updatePath, transformState(getValueByPath(updatedState, path), payload, meta), $status);
    }

    return updatedState;
  } else if (!update || typeof update === 'object') {
    if (error && activeTransactionState[$status.transactionId] && !$status.isActive) {
      const errorState = updateItem(state, updatePath, convertObject(activeTransactionState[$status.transactionId]), $status);

      delete activeTransactionState[$status.transactionId];

      return errorState;
    }

    if (!update) {
      return updateNewItem(state, path, updatePath, useSeed && convertObject(seedPayload), $status);
    }

    return updateItem(
        (isArray(update) && updateItem(state, getUpdatePath(isArray, update, '', path), useSeed && convertObject(seedPayload), $status)) || state,
        updatePath,
        useSeed && convertObject(seedPayload),
        $status
    );
  }

  return state;
};

export default updateState;

export { parsePath, decorateStatus };
