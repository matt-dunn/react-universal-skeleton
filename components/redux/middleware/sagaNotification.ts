import {take} from "redux-saga/effects";
import {getType} from "typesafe-actions";
import {isFunction} from "lodash";

import {ErrorLike} from "components/error";
import {Notify, notifyAction, Severity, Notification} from "components/notification";
import {ActionMeta} from "components/state-mutate-with-status";

export type WithNotification<P = any> = {
    notification?: Notification | {(payload: P | undefined, error: ErrorLike | undefined): Notification | undefined | void};
}

export function* sagaNotification(notify: Notify) {
    while (true) {
        const {type, error, payload, meta: {$status, notification} = {} as ActionMeta & WithNotification} = yield take("*");

        if (type === getType(notifyAction)) {
            notify(payload);
        } else if (($status?.complete || error) && notification && isFunction(notification)) {
            const n = notification((!error && payload) || undefined, (error && payload) || undefined);
            n && notify(n);
        } else if ($status?.complete && notification) {
            notify(notification);
        } else if (error && $status?.error) {
            notify({
                message: $status.error.message,
                reference: $status.error.code,
                severity: Severity.error
            });
        }
    }
}
