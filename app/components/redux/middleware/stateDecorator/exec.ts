import { FluxStandardAction } from 'flux-standard-action';
import { Dispatch } from "redux";

import { IOptions } from "./index";

const exec = (
    next: Dispatch<FluxStandardAction<string, any, any>>,
    transactionId: string,
    originalPayload: any,
    action: FluxStandardAction<string, any, any>,
    dispatchOptions: IOptions,
    { resolve , reject }: any = {}
) => {
  const { meta: { retryCount = 1, $status: { isActive = false } = {} } = {} } = action;

  let timeout: number;

  next({
    type: action.type,
    meta: {
      ...action.meta,
      $status: {
        transactionId,
        isActive,
        hasError: false,
        complete: false,
        processing: true,
        loading: false,
      },
    },
  });

  if (dispatchOptions && dispatchOptions.loadingState && dispatchOptions.loadingState.include) {
    timeout = <any>setTimeout(() => {
      next({
        type: action.type,
        meta: {
          ...action.meta,
          $status: {
            transactionId,
            isActive,
            hasError: false,
            complete: false,
            processing: true,
            loading: true,
          },
        },
      });
    }, dispatchOptions.loadingState.timeout);
  }

  return action.payload
    .then((payload: any) => {
      next({
        type: action.type,
        payload,
        meta: {
          ...action.meta,
          $status: {
            transactionId,
            isActive: false,
            hasError: false,
            complete: true,
            processing: false,
            loading: false,
          },
        },
      });

      resolve && resolve(payload);

      return payload;
    })
    .catch((reason: Error) => {
      const actionMeta = (resolve && reject) && {
        retryCount,
        retry: () => {
          exec(
              next,
              transactionId,
              originalPayload,
              {
                ...action,
                payload: originalPayload({retryCount, ...dispatchOptions.dependencies}),
                meta: {
                  ...action.meta,
                  retryCount: retryCount + 1,
                  $status: {...(action.meta || {}).$status, isActive: true}
                }
              },
              dispatchOptions,
              {
                resolve,
                reject,
              }
          );
        },
        cancel: () => {
          reject(reason);
        },
      };

      if (<unknown>next({
        type: action.type,
        error: true,
        payload: reason,
        meta: {
          ...action.meta,
          ...actionMeta,
          notify: true,
          $status: {
            transactionId,
            isActive: (actionMeta && true) || false,
            hasError: true,
            complete: false,
            processing: false,
            loading: false,
            error: reason,
          },
        },
      }) !== true && reject) {
        reject(reason);
      } else if (!reject) {
        throw reason;
      }
    })
    .finally(() => {
      clearTimeout(timeout);
    });
};

export default exec;
