import {
  Dispatch, Middleware,
} from 'redux';

export interface IError { message: string; code: string; status: string }

export interface INotify { error: IError; type: string; cancel: Function; retry: Function }

export type TNotify = (notification: INotify) => boolean;

const notification = ({ notify }: { notify: TNotify }) => () => (next: Dispatch): Middleware => (action: any) => {
  const ret = next(action);

  if (action.error && notify) {
    const { payload, type, meta: { cancel, retry, notify: showNotification = false } } = action;

    if (showNotification) {
      return notify({
        type, cancel, retry, error: payload,
      }) === true || ret;
    }
  }

  return ret;
};

export default notification;
