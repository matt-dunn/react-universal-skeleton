import { IAPPError } from '../api';

const symbolActiveTransactions = Symbol('activeTransactions');

export type IActiveTransactions<T = boolean> = {
  [id: string]: T;
}

export type IStatus = {
  readonly lastUpdated?: number;
  readonly complete: boolean;
  readonly processing: boolean;
  readonly hasError?: boolean;
  readonly error?: IAPPError;
  readonly isActive: boolean;
  readonly outstandingTransactionCount: number,
  readonly [symbolActiveTransactions]: IActiveTransactions;
}

export type IStatusTransaction = {
  readonly transactionId: string;
} & IStatus

const Status = (status: IStatus = {} as IStatus): IStatus => {
  const {
    lastUpdated, complete = false, processing = false, hasError = false, error, isActive = false,
  } = status;

  const activeTransactions = status[symbolActiveTransactions] || {};

  return {
    lastUpdated,
    complete,
    processing,
    hasError,
    isActive,
    error,
    outstandingTransactionCount: Object.keys(activeTransactions).length,
    [symbolActiveTransactions]: { ...activeTransactions },
  };
};

export { symbolActiveTransactions };

export default Status;
