import isEqual from 'lodash/isEqual';

import Status, {IStatus, IStatusTransaction, symbolActiveTransactions} from "./status";

const parsePath = (path: string): string[] => (path && path.split('.')) || [];

const makePath = (pathArray: (string | number)[]): string => pathArray.join('.');

const findIndex = (obj: any[], id: string): number => obj.findIndex((item: any) =>
    ((item.get && item.get('id')) || item.id) === id);

const getUpdatePath = (isArray: Function, obj: any, id: string, path: string): string => {
    if (path && isArray(obj)) {
        const index = findIndex(obj, id);

        if (index === -1) {
            return makePath(parsePath(path).slice(0, -1));
        }
        return makePath([path, index]);
    }

    return path;
};

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

export { parsePath, makePath, findIndex, getUpdatePath, decorateStatus };
