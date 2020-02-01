import {take} from "redux-saga/effects";
import {createAction, getType} from "typesafe-actions";
import {ReactNode} from "react";

type Action = {
    type: string;
}

export enum Severity {
    info = "info",
    warning = "warning",
    error = "error"
}

export type Notification = {
    message: ReactNode;
    severity?: Severity;
    reference?: string;
    reason?: Action;
}

export type Notify = {
    (notification: Notification): void;
}

export const notifyAction = createAction(
    "@notification/NOTIFY",
    ({message, reference, reason, severity = Severity.info}: Notification): Notification => ({
        message,
        severity,
        reference,
        reason
    })
)();

export function* sagaNotification(notify: Notify) {
    while (true) {
        const {payload} = yield take(getType(notifyAction));
        notify(payload);
    }
}
