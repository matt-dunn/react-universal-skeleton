import {take} from "redux-saga/effects";
import {getType} from "typesafe-actions";

import {Notify, notifyAction, Severity} from "components/notification";
import {ActionMeta} from "components/state-mutate-with-status";

export function* sagaNotification(notify: Notify) {
    while (true) {
        const {type, error, payload, meta: {$status} = {} as ActionMeta} = yield take("*");

        if (error && $status.error) {
            notify({
                message: $status.error.message,
                severity: Severity.error
            });
        } else if (type === getType(notifyAction)) {
            notify(payload);
        }
    }
}
