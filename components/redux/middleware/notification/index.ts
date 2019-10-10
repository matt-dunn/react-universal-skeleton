import {
  Dispatch, Middleware,
} from 'redux';

import {ErrorLike} from "components/error";

export interface INotify { error: ErrorLike; type: string; cancel: Function; retry: Function }

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
