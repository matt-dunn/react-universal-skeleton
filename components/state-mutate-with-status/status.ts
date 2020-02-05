import {WrappedPromise} from "components/wrappedPromise";
import {errorLike, ErrorLike} from "../error";

const symbolActiveTransactions = Symbol("activeTransactions");
export const symbolStatus = Symbol("$status");

type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
type WithOptional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

type ActiveTransactions<T = boolean> = {
  [id: string]: T;
}

export type ActionMeta<P = any> = {
  id?: string;
  $status?: MetaStatus;
  seedPayload?: P;
  response?: WrappedPromise;
}

type StatusBase = {
  readonly processing: boolean;
  readonly complete: boolean;
  readonly processedOnServer: boolean;
  readonly lastUpdated?: number;
  readonly hasError? : boolean;
  readonly error?: ErrorLike;
  readonly cancelled?: boolean;
}

export type MetaStatus = {
  readonly transactionId: string;
} & StatusBase;

export type MetaStatusPartial = WithOptional<MetaStatus, "processing" | "complete" | "processedOnServer">;

export type Status = {
  readonly updatingChildren: boolean;
  readonly outstandingTransactionCount: number;
  readonly [symbolActiveTransactions]: ActiveTransactions;
} & StatusBase;

export type StatusPartial = WithOptional<Status, "hasError" | "error" | "cancelled" | "processing" | "complete" | "processedOnServer" | "outstandingTransactionCount" | "updatingChildren">;

export type DecoratedWithStatus = {
  readonly [symbolStatus]?: Status;
}

export const Status = (status: StatusPartial = {} as Status): Status => {
  const {
    lastUpdated, complete = false, processing = false, hasError = false, error, processedOnServer = false, cancelled = false
  } = status;

  const activeTransactions = status[symbolActiveTransactions] || {};
  const outstandingTransactionCount = Object.keys(activeTransactions).length;

  return {
    lastUpdated,
    complete,
    processing,
    hasError,
    cancelled,
    processedOnServer,
    error: error && errorLike(error),

    outstandingTransactionCount,
    updatingChildren: !processing && outstandingTransactionCount > 0,
    [symbolActiveTransactions]: { ...activeTransactions },
  };
};

export const MetaStatus = (status: MetaStatusPartial): MetaStatus => ({
  processing: false,
  complete: false,
  processedOnServer: false,
  ...status
});

export const getStatus = <P extends DecoratedWithStatus>(payload?: P): Status => (payload && payload[symbolStatus]) || Status();

export { symbolActiveTransactions };

