type ErrorLike = {
  message: string;
  name?: string;
  code?: string;
  status?: number;
}

const symbolActiveTransactions = Symbol('activeTransactions');

export type IActiveTransactions<T = boolean> = {
  [id: string]: T;
}

export type IStatus = {
  readonly lastUpdated?: number;
  readonly complete: boolean;
  readonly processedOnServer: boolean;
  readonly processing: boolean;
  readonly hasError?: boolean;
  readonly error: ErrorLike;
  readonly isActive: boolean;
  readonly outstandingTransactionCount: number;
  readonly [symbolActiveTransactions]: IActiveTransactions;
}

export type IStatusTransaction = {
  readonly transactionId: string;
} & IStatus

const errorLike = (error: ErrorLike & {[index: string]:any}): ErrorLike => {
  const {stack, ...rest} = Object.getOwnPropertyNames(error).reduce((o: any, key: string) => {
    o[key] = error[key];
    return o;
  }, {});

  return rest;
};

const Status = (status: IStatus = {} as IStatus): IStatus => {
  const {
    lastUpdated, complete = false, processing = false, hasError = false, error, isActive = false, processedOnServer = false
  } = status;

  const activeTransactions = status[symbolActiveTransactions] || {};

  return {
    lastUpdated,
    complete,
    processing,
    hasError,
    isActive,
    processedOnServer,
    error: error && errorLike(error),
    outstandingTransactionCount: Object.keys(activeTransactions).length,
    [symbolActiveTransactions]: { ...activeTransactions },
  };
};

export { symbolActiveTransactions };

export default Status;
