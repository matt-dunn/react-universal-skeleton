import { errorLike, ErrorLike } from "../error";

const symbolActiveTransactions = Symbol("activeTransactions");
export const symbolStatus = Symbol("$status");

type ActiveTransactions<T = boolean> = {
  [id: string]: T;
}

export type ActionMeta<P = any> = {
  id?: string;
  $status?: MetaStatus;
  seedPayload?: P;
  props?: any;
  readonly controller?: AbortController;
}

type StatusBase = {
  readonly complete: boolean;
  readonly processing: boolean;
  readonly lastUpdated?: number;
  readonly error?: ErrorLike;
  readonly cancelled?: boolean;
}

export type MetaStatus = {
  readonly transactionId: string;
} & StatusBase;

type StatusActiveTransactions = {
  readonly [symbolActiveTransactions]: ActiveTransactions;
}

type StatusUpdate = StatusActiveTransactions & Partial<StatusBase>

export type Status = {
  readonly hasError? : boolean;
  readonly updatingChildren: boolean;
  readonly outstandingTransactionCount: number;
  readonly outstandingCurrentTransactionCount: number;
  readonly processedOnServer: boolean;
} & StatusActiveTransactions & StatusBase;

export type DecoratedWithStatus = {
  readonly [symbolStatus]?: Status;
}

export const Status = (status: StatusUpdate = {} as StatusUpdate): Status => {
  const {
    lastUpdated, error, complete = false, cancelled = false, [symbolActiveTransactions]: activeTransactions = {}
  } = status;

  const outstandingTransactionCount = Object.keys(activeTransactions).length;
  const outstandingCurrentTransactionCount = Object.values(activeTransactions).filter(current => current === true).length;

  return {
    lastUpdated,
    cancelled,
    error: error && errorLike(error),
    [symbolActiveTransactions]: { ...activeTransactions },
    complete,

    processedOnServer: !(process as any).browser,
    hasError: (error && true) || false,
    processing: outstandingCurrentTransactionCount > 0,
    outstandingTransactionCount,
    outstandingCurrentTransactionCount,
    updatingChildren: outstandingTransactionCount - outstandingCurrentTransactionCount > 0,
  };
};

export const MetaStatus = (status: MetaStatus): MetaStatus => ({
  processing: false,
  ...status
});

export const getStatus = <P extends DecoratedWithStatus>(payload?: P): Status => (payload && payload[symbolStatus]) || Status();

export { symbolActiveTransactions };

