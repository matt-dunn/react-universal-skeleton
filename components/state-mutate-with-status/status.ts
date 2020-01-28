import {errorLike, ErrorLike} from "../error";

const symbolActiveTransactions = Symbol("activeTransactions");

type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
type WithOptional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

export type ActiveTransactions<T = boolean> = {
  [id: string]: T;
}

export type Status = {
  readonly lastUpdated?: number;
  readonly complete: boolean;
  readonly processedOnServer: boolean;
  readonly processing: boolean;
  readonly hasError: boolean;
  readonly cancelled?: boolean;
  readonly error?: ErrorLike;
  readonly isActive: boolean;
  readonly outstandingTransactionCount: number;
  readonly [symbolActiveTransactions]: ActiveTransactions;
}

export type StatusTransaction = {
  readonly transactionId: string;
} & Status

export type DecoratedWithStatus = {
  readonly $status?: Status;
}

export const Status = (status: WithOptional<Status, "hasError" | "error" | "cancelled" | "processing" | "complete" | "processedOnServer" | "isActive" | "outstandingTransactionCount"> = {} as Status): Status => {
  const {
    lastUpdated, complete = false, processing = false, hasError = false, error, isActive = false, processedOnServer = false, cancelled = false
  } = status;

  const activeTransactions = status[symbolActiveTransactions] || {};

  return {
    lastUpdated,
    complete,
    processing,
    hasError,
    isActive,
    cancelled,
    processedOnServer,
    error: error && errorLike(error),
    outstandingTransactionCount: Object.keys(activeTransactions).length,
    [symbolActiveTransactions]: { ...activeTransactions },
  };
};

export const getStatus = <P extends DecoratedWithStatus>(payload?: P): Status => (payload && payload.$status) || Status();

export { symbolActiveTransactions };

