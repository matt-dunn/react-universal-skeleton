import Immutable from 'immutable';
import updateState, { parsePath, decorateStatus } from './state';
import { IStatusTransaction } from './status';

const isArray = (obj: any) => Immutable.isList(obj);

const getValueByPath = (obj: any, path: string) => obj.getIn(parsePath(path));

const convertObject = (obj: any) => Immutable.fromJS(obj);

const updateNewItem = (state: any, path: string, updatePath: string, item: any, $status: IStatusTransaction, addItem?: Function) => state.withMutations((o: any) => {
  o.updateIn(parsePath(path), (value: any) => (value && ((addItem && addItem(value, item)) || value.push(item))) || item);
  o.updateIn(parsePath(updatePath), (value: any) => (value || Immutable.Map()).update('$status', (currentStatus: IStatusTransaction) => decorateStatus($status, currentStatus)));
});

const deleteItem = (state: any, updatePath: string) => state.deleteIn(parsePath(updatePath));

const updateItem = (state: any, updatePath: string, item: any, $status: IStatusTransaction) => state.updateIn(parsePath(updatePath), (value: any) => value.withMutations((o: any) => {
  o.merge(item);
  o.update('$status', (currentStatus: IStatusTransaction) => decorateStatus($status, currentStatus));
}));

export default updateState({
  isArray, getValueByPath, convertObject, updateNewItem, deleteItem, updateItem,
});
