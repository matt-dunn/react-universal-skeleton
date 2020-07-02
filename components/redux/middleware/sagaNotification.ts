import { take } from "redux-saga/effects";
import { getType } from "typesafe-actions";
import { isFunction } from "lodash";

import { ErrorLike } from "components/error";
import { Notify, notifyAction, Severity, Notification } from "components/notification";
import { ActionMeta } from "components/state-mutate-with-status";

export type WithNotification<P = any> = {
    notification: Notification | {(payload: P | undefined, error: ErrorLike | undefined, meta: ActionMeta): Notification | undefined | void};
}

export type ActionError = {
  type: string;
  error: ErrorLike;
}

const ErrorStatusBlacklist = [401, 403, 404];

export function* sagaNotification (notify: Notify) {
  while (true) {
    const { type, error, payload, meta: { $status, notification, ...restMeta } = {} as ActionMeta & WithNotification } = yield take("*");

    let cancelled = false;

    if ($status?.error) {
      const event = new CustomEvent<ActionError>("actionError", {
        bubbles: true,
        cancelable: true,
        detail: {
          type,
          error: $status.error
        }
      });

      cancelled = !window.dispatchEvent(event);
    }

    if (!cancelled) {
      if (type === getType(notifyAction)) {
        notify(payload);
      } else if (($status?.lastUpdated || error) && notification && isFunction(notification)) {
        const n = notification((!error && payload) || undefined, (error && payload) || undefined, restMeta);
        n && notify(n);
      } else if ($status?.complete && notification) {
        notify(notification);
      } else if (error && $status.error && ErrorStatusBlacklist.indexOf($status.error.status) === -1) {
        notify({
          message: $status.error.message,
          reference: $status.error.code,
          severity: Severity.error,
          type
        });
      }
    }
  }
}
