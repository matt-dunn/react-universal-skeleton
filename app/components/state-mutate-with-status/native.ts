import immutable from 'object-path-immutable';
import { get } from 'lodash';
import updateState, { parsePath, decorateStatus } from './state';
import { IStatusTransaction } from './status';

const isArray = (obj: any) => Array.isArray(obj);

const getValueByPath = (obj: any, path: string) => (path && get(obj, path)) || obj;

const convertObject = (obj: any) => obj;

const updateNewItem = (state: any, path: string, updatePath: string, item: any, $status: IStatusTransaction, addItem?: Function) => immutable.update(
  immutable.update(state, path, value => (value && ((addItem && addItem(value, item)) || [...value, item]))) || item,
  parsePath(updatePath),
  value => immutable.update(value, '$status', currentStatus => decorateStatus($status, currentStatus)),
);

const deleteItem = (state: any, updatePath: string) => immutable.del(state, parsePath(updatePath));

const updateItem = (state: any, updatePath: string, item: any, $status: IStatusTransaction) =>
  immutable.update(state, parsePath(updatePath), obj => immutable.update(obj, undefined, value =>
    Object.assign(value || {}, item, { $status: decorateStatus($status, value && value.$status) })));

export default updateState({
  isArray, getValueByPath, convertObject, updateNewItem, deleteItem, updateItem,
});
