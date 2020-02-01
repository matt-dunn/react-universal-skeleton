import {take} from "redux-saga/effects";
import {getType} from "typesafe-actions";
import {Notify, notifyAction} from "components/notification";

export function* sagaNotification(notify: Notify) {
    while (true) {
        const {payload} = yield take(getType(notifyAction));
        notify(payload);
    }
}
