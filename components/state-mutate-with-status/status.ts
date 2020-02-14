import {WrappedPromise} from "components/wrappedPromise";
import {errorLike, ErrorLike} from "../error";

const symbolActiveTransactions = Symbol("activeTransactions");
export const symbolStatus = Symbol("$status");

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
  readonly error?: ErrorLike;
  readonly cancelled?: boolean;
}

export type MetaStatus = {
  readonly transactionId: string;
} & StatusBase;

export type Status = {
  readonly hasError? : boolean;
  readonly updatingChildren: boolean;
  readonly outstandingTransactionCount: number;
  readonly outstandingCurrentTransactionCount: number;
  readonly [symbolActiveTransactions]: ActiveTransactions;
} & StatusBase;

export type StatusPartial = Omit<Status, "complete" | "processing" | "outstandingTransactionCount" | "outstandingCurrentTransactionCount" | "updatingChildren" | "hasError">;

export type DecoratedWithStatus = {
  readonly [symbolStatus]?: Status;
}

export const Status = (status: StatusPartial = {} as StatusPartial): Status => {
  const {
    lastUpdated, error, processedOnServer = false, cancelled = false, [symbolActiveTransactions]: activeTransactions = {}
  } = status;

  const outstandingTransactionCount = Object.keys(activeTransactions).length;
  const outstandingCurrentTransactionCount = Object.values(activeTransactions).filter(current => current === true).length;

  return {
    lastUpdated,
    cancelled,
    processedOnServer,
    error: error && errorLike(error),
    [symbolActiveTransactions]: { ...activeTransactions },

    hasError: (error && true) || false,
    complete: outstandingCurrentTransactionCount === 0,
    processing: outstandingCurrentTransactionCount > 0,
    outstandingTransactionCount,
    outstandingCurrentTransactionCount,
    updatingChildren: outstandingTransactionCount - outstandingCurrentTransactionCount > 0,
  };
};

export const MetaStatus = (status: MetaStatus): MetaStatus => ({
  processing: false,
  complete: false,
  processedOnServer: false,
  ...status
});

export const getStatus = <P extends DecoratedWithStatus>(payload?: P): Status => (payload && payload[symbolStatus]) || Status();

export { symbolActiveTransactions };

