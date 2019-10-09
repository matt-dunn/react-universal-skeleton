import {IActiveTransactions, IStatusTransaction} from "./status";

const pendingTransactionState = {} as IActiveTransactions<any>;

export const getPendingState = (transactionId: string): any => {
    return pendingTransactionState[transactionId];
};

export const setPendingState = (status: IStatusTransaction, value: any): void => {
    if (status.isActive) {
        if (pendingTransactionState[status.transactionId] === undefined) {
            pendingTransactionState[status.transactionId] = value;
        }
    } else {
        delete pendingTransactionState[status.transactionId];
    }
};
