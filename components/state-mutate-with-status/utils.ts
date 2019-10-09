import isEqual from 'lodash/isEqual';

import Status, {IStatus, IStatusTransaction, symbolActiveTransactions} from "./status";

export const decorateStatus = (status: IStatusTransaction, $status: IStatus = {} as IStatus): IStatus => {
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

export const serialize = (o: any): string => {
    return o && JSON.stringify(o, (key: string, value: any) => {
        if (Array.isArray(value)) {
            const keys = Object.keys(value);
            if (keys.length !== value.length) {
                return {
                    $$arr: {
                        $: [...value],
                        _: keys.reduce((o, key: any) => {
                            if (isNaN(key)) {
                                o[key] = value[key];
                            }
                            return o;
                        }, {} as any)
                    }
                }
            }
        }

        return value
    })
};

export const deserialize = (s: string): any => {
    return s && JSON.parse(s, (key, value) => {
        if (value && value.$$arr) {
            const {$: array, _: values} = value.$$arr;

            Object.keys(values).forEach(key => {
                array[key] = values[key]
            })
            return array
        }
        return value;
    })
};
