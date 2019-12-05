import isPromise from "is-promise";
import {
  Dispatch, Middleware,
} from "redux";

import {ErrorLike} from "components/error";

export interface Notification { error: ErrorLike; type: string; cancel: Function; retry: Function }

export type NotifyCallback = (notification: Notification) => boolean;
export type Notify = () => NotifyCallback | Promise<NotifyCallback>;

const notification = ({ notify }: { notify: Notify }) => () => (next: Dispatch): Middleware => (action: any) => {
  const ret = next(action);

  if (action.error && notify) {
    const { payload, type, meta: { cancel, retry, notify: showNotification = false } } = action;

    if (showNotification) {
      const notification = notify();

      if (isPromise(notification)) {
        return notification
            .then(notify => notify({
              type, cancel, retry, error: payload,
            }))
            .then(notify => notify || ret);
      } else {
        return notification({
          type, cancel, retry, error: payload,
        }) || ret;
      }
    }
  }

  return ret;
};

export default notification;
