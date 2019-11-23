import {
  Dispatch, Middleware,
} from "redux";

import {ErrorLike} from "components/error";

export interface Notification { error: ErrorLike; type: string; cancel: Function; retry: Function }

export type Notify = (notification: Notification) => boolean;

const notification = ({ notify }: { notify: Notify }) => () => (next: Dispatch): Middleware => (action: any) => {
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
