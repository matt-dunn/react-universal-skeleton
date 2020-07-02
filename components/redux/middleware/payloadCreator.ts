import { Dispatch, MiddlewareAPI } from "redux";
import { isFunction } from "lodash";
import isPromise from "is-promise";

import { StandardAction } from "components/state-mutate-with-status";

export type PayloadCreator<A extends any[], R> =
  R
  |
  {
    (signal?: AbortSignal): {
      (...args: A): R;
    };
  }
  |
  {
    (signal?: AbortSignal): R;
  }

const createPayload = <P extends PayloadCreator<any, any>>(response: P) => (signal?: AbortSignal) => (...args: P extends ((...args: infer P) => any) ? P : never[]) => {
  if (isFunction(response)) {
    const ret = response(signal);

    if (isFunction(ret)) {
      return ret(...args);
    } else {
      return ret;
    }
  }

  return response;
};

type ThenArg<T> = T extends PromiseLike<infer U> ? U : never

type ActionCreatorPayload<T> = T extends ({payload: infer P}) ? Promise<ThenArg<P>> : never

type ActionCreator<T> = {
  (...args: T extends ((...args: infer P) => any) ? P : never[]): T extends ((...args: infer P) => infer PP) ? ActionCreatorPayload<PP> : never;
}

type Actions<T> = {
  [K in keyof T]: ActionCreator<T[K]>
};

export type UnwrapActions<T> = Actions<T>;

interface PayloadCreatorMiddleware<
  DispatchExt = {},
  S = any,
  D extends Dispatch = Dispatch
  > {
  (api: MiddlewareAPI<D, S>): (
    next: Dispatch<StandardAction>
  ) => (action: StandardAction) => any;
}

export const payloadCreator = (...args: any[]): PayloadCreatorMiddleware => () => (next) => (action) => {
  if (isFunction(action.payload) || isPromise(action.payload)) {
    const controller = new AbortController();

    const payload = createPayload(action.payload)(controller.signal)(...args);

    next({
      ...action,
      payload,
      meta: {
        ...action.meta,
        controller
      }
    });

    return payload;
  }

  return next(action);
};
