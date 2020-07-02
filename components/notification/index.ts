import { createAction } from "typesafe-actions";
import { ReactNode } from "react";

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
    id?: string;
    type?: string;
}

export type Notify = {
    (notification: Notification): void;
}

export const notifyAction = createAction(
  "@notification/NOTIFY",
  ({ message, reference, reason, severity = Severity.info }: Notification): Notification => ({
    message,
    severity,
    reference,
    reason
  })
)();
