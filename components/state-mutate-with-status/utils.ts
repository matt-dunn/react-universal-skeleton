import isEqual from 'lodash/isEqual';

import Status, {IStatus, IStatusTransaction, symbolActiveTransactions} from "./status";

const decorateStatus = (status: IStatusTransaction, $status: IStatus = {} as IStatus): IStatus => {
    const activeTransactions = { ...$status[symbolActiveTransactions] };

    if (status.processing) {
        activeTransactions[status.transactionId] = true;
    } else {
        delete activeTransactions[status.transactionId];
    }

    const hasActiveTransactions = activeTransactions && Object.keys(activeTransactions).length > 0;

    const updatedStatus = Status({
        ...status,
        complete: hasActiveTransactions ? false : status.complete,
        processing: hasActiveTransactions ? ($status && $status.processing) || status.processing : status.processing,
        [symbolActiveTransactions]: activeTransactions,
    });

    if (isEqual(updatedStatus, $status)) {
        return $status;
    }

    return updatedStatus;
};

export { decorateStatus };
