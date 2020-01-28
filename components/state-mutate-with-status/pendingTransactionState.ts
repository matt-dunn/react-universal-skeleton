import {ActiveTransactions, StatusTransaction} from "./status";

const pendingTransactionState = {} as ActiveTransactions<any>;

export const getPendingState = (transactionId: string): any => {
    return pendingTransactionState[transactionId];
};

export const setPendingState = (status: StatusTransaction, value: any): void => {
    if (status.isActive) {
        if (pendingTransactionState[status.transactionId] === undefined) {
            pendingTransactionState[status.transactionId] = value;
        }
    } else {
        delete pendingTransactionState[status.transactionId];
    }
};
