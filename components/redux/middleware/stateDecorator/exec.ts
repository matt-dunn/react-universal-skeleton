import { FluxStandardAction } from "flux-standard-action";
import { Dispatch } from "redux";

import { Options } from "./index";

const exec = (
    next: Dispatch<FluxStandardAction<string, any, any>>,
    transactionId: string,
    originalPayload: any,
    action: FluxStandardAction<string, any, any>,
    dispatchOptions: Options,
    { resolve , reject }: any = {}
) => {
  const { meta: { retryCount = 1, $status: { isActive = true } = {} } = {} } = action;

  next({
    type: action.type,
    meta: {
      ...action.meta,
      $status: {
        transactionId,
        isActive,
        hasError: false,
        complete: false,
        processing: true
      },
    },
  });

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
            processedOnServer: !(process as any).browser,
            lastUpdated: Date.now(),
            processing: false
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

      if (next<any>({
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
            lastUpdated: Date.now(),
            processedOnServer: !(process as any).browser,
            error: reason,
          },
        },
      }) !== true && reject) {
        reject(reason);
      } else if (!reject) {
        throw reason;
      }
    });
};

export default exec;
