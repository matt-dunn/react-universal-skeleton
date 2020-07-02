import { put, cancelled, fork, take, cancel } from "redux-saga/effects";
import uuid from "uuid";
import isPromise from "is-promise";

import { StandardAction, MetaStatus, ActionMeta } from "components/state-mutate-with-status";

type Task = {
  /**
   * Returns true if the task hasn't yet returned or thrown an error
   */
  isRunning(): boolean;
  /**
   * Returns true if the task has been cancelled
   */
  isCancelled(): boolean;
  /**
   * Returns task return value. `undefined` if task is still running
   */
  result<T = any>(): T | undefined;
  /**
   * Returns task thrown error. `undefined` if task is still running
   */
  error(): any | undefined;
  /**
   * Returns a Promise which is either:
   * - resolved with task's return value
   * - rejected with task's thrown error
   */
  toPromise<T = any>(): Promise<T>;
  /**
   * Cancels the task (If it is still running)
   */
  cancel(): void;
  setContext<C extends object>(props: Partial<C>): void;
}

type Pending = {
  [key: string]: {
    task: Task;
    action: StandardAction;
  };
}

type Done = {
  (action: StandardAction): void;
}

const decorateMetaWithStatus = <M extends ActionMeta>(transactionId: string, status: Partial<Omit<MetaStatus, "transactionId">>, meta?: M): M & ActionMeta => ({
  ...meta || {} as M,
  $status: MetaStatus({ processing: false, complete: false, ...status, transactionId })
});

const getName = (action: StandardAction) => `${action.type}${action?.meta?.id ? `-${action.meta.id}`: ""}`;

const CANCEL_TASK_POSTFIX = "$CANCEL$";

export const makeCancelAction = (type: string) => `${type}${CANCEL_TASK_POSTFIX}`;

const isCancelAction = (action: StandardAction) => getName(action).indexOf(CANCEL_TASK_POSTFIX) !== -1;

const makeCancelActionMatcher = (type: string) => new RegExp("^" + type.replace(CANCEL_TASK_POSTFIX, "").replace("*", ".*?"));

function* callAsyncWithCancel (action: StandardAction, done?: Done) {
  const transactionId = uuid.v4();
  const controller = action.meta?.controller;

  try {
    yield put({
      ...action,
      payload: action?.meta?.seedPayload,
      meta: decorateMetaWithStatus(transactionId, {
        processing: true,
      }, action.meta)
    });

    const payload = yield action.payload;

    yield put({
      ...action,
      payload,
      meta: decorateMetaWithStatus(transactionId, {
        complete: true,
        lastUpdated: Date.now()
      }, action.meta)
    });
  } catch (error) {
    yield put({
      ...action,
      payload: error,
      error: true,
      meta: decorateMetaWithStatus(transactionId, {
        error,
      }, action.meta)
    });
  } finally {
    done && done(action);

    if (yield cancelled()) {
      controller?.abort();

      yield put({
        ...action,
        payload: [],
        meta: decorateMetaWithStatus(transactionId, {
          cancelled: true,
        }, action.meta)
      });
    }
  }
}

const takeAsync = (saga: (...args: any[]) => any, ...args: any[]) => fork(function*() {
  const pending: Pending = {};

  const done: Done = action => delete pending[getName(action)];

  while (true) {
    const action = yield take((action: StandardAction) => isPromise(action.payload) || isCancelAction(action));
    const name = getName(action);

    console.error("@@",name);

    if (isCancelAction(action)) {
      const cancelActionMatcher = makeCancelActionMatcher(name);

      const tasks = Object.entries(pending)
        .filter(([key]) => cancelActionMatcher.test(key))
        .map(([, action]) => action.task);

      yield cancel(tasks);
    } else {
      if (pending[name] && name === getName(pending[name].action)) {
        yield cancel(pending[name].task);
      }

      pending[name] = {
        task: yield fork(saga, ...[action, done, ...args]),
        action
      };
    }
  }
});

export function* sagaAsyncAction (...args: any[]) {
  return yield takeAsync(callAsyncWithCancel, ...args);
}
