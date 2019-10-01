import isPromise from 'is-promise';
import defaultsDeep from 'lodash/defaultsDeep';
import uuid from 'uuid';
import { isFSA } from 'flux-standard-action';
import { FluxStandardAction } from 'flux-standard-action';
import { Dispatch } from "redux";

import exec from './exec';

export type IDependencies = {
  [id: string]: any;
}

export type IOptions = {
  dependencies?: IDependencies;
}

export type IPayload = {
  retryCount?: number;
} & IDependencies

const stateDecorator = (options: IOptions) => () => {
  const dispatchOptions = defaultsDeep({}, options, {
  }) as IOptions;

  return (next: Dispatch<FluxStandardAction<string, any, any>>) => (action: FluxStandardAction<string, any, any>) => {
    const actionPayload = typeof action.payload === 'function' ? action.payload({ ...dispatchOptions.dependencies }) : action.payload;

    if (isFSA(action) && isPromise(actionPayload)) {
      const transactionId = uuid.v4();

      if (typeof action.payload === 'function') {
        return new Promise((resolve, reject) => exec(next, transactionId, action.payload, { ...action, payload: actionPayload }, dispatchOptions, {
          resolve,
          reject,
        }))
          .catch((reason) => {
            next({
              type: action.type,
              error: true,
              payload: reason,
              meta: {
                ...action.meta as any,
                $status: {
                  transactionId,
                  isActive: false,
                  hasError: true,
                  complete: false,
                  processing: false,
                  lastUpdated: Date.now(),
                  processedOnServer: (process as any).browser !== true,
                  error: reason,
                },
              },
            });

            throw reason;
          });
      }

      return exec(next, transactionId, action.payload, { ...action, payload: actionPayload }, dispatchOptions);
    }

    return next({ ...action, payload: actionPayload });
  };
};

export default stateDecorator;
