import isEqual from "lodash/isEqual";
import { get } from "lodash";
import immutable from "object-path-immutable";

import {Status, StatusTransaction, symbolActiveTransactions, symbolStatus} from "./status";
import {getPendingState} from "./pendingTransactionState";
import {Options, Path} from "./index";

export type UpdatedStatus<S, P> = {
    updatedState: S;
    originalState?: P | null;
    isCurrent?: boolean;
}

export const decorateStatus = (status: StatusTransaction, $status: Status = {} as Status, isCurrent = true): Status => {
    const activeTransactions = { ...$status[symbolActiveTransactions] };

    if (status.processing) {
        activeTransactions[status.transactionId] = isCurrent;
    } else {
        delete activeTransactions[status.transactionId];
    }

    const hasActiveTransactions = activeTransactions && Object.keys(activeTransactions).length > 0;

    const updatedStatus = Status({
        ...status,
        complete: hasActiveTransactions ? false : status.complete,
        processing: activeTransactions[status.transactionId] === true,
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
                };
            }
        }

        return value;
    });
};

export const deserialize = (s: string): any => {
    return s && JSON.parse(s, (key, value) => {
        if (value && value.$$arr) {
            const {$: array = [], _: values} = value.$$arr;

            values && Object.keys(values).forEach(key => {
                array[key] = values[key];
            });

            return array;
        }
        return value;
    });
};

export const getPayload = <S extends StatusTransaction, P>(status: S, payload: P, seedPayload?: P): P | undefined | null => {
    if (status.isActive) {
        return status.hasError ? seedPayload : payload || seedPayload;
    } else if (status.hasError) {
        return getPendingState(status.transactionId);
    }

    return status.complete ? payload : seedPayload;
};

export const getUpdatedState = <S, P, U extends StatusTransaction>(state: S, payload: P, status: U, path: Path, actionId?: string, options?: Options<P>): UpdatedStatus<S, P> => {
    if (actionId) {
        const array = get(state, path);

        if (Array.isArray(array)) {
            const index = array.findIndex(item => item.id === actionId);

            if (index === -1) {
                if (payload) {
                    const { getNewItemIndex } = options || {} as Options<P>;

                    return {
                        updatedState: immutable.insert(state, path, Object.assign({}, payload, {[symbolStatus]: decorateStatus(status)}), getNewItemIndex ? getNewItemIndex(array, payload) : array.length),
                        originalState: null // Ensure final payload is not set so this item can be removed from the array on failure
                    };
                }
            } else if (payload === null) {
                return {
                    updatedState: immutable.del(
                        state,
                        [...path, index.toString()]
                    ) as any
                };
            } else {
                return {
                    updatedState: immutable.update(
                        (payload && immutable.assign(state, [...path, index.toString()], payload as any)) || state,
                        [...path, index.toString(), symbolStatus as any],
                        state => decorateStatus(status, state && state[symbolStatus])
                    ) as any,
                    originalState: get(state, [...path, index.toString()])
                };
            }
        } else {
            throw new TypeError(`Item in state at ${path.join(".")} must be an array when meta.id (${actionId}) is specified`);
        }

        return {
            updatedState: state
        };
    } else {
        return {
            updatedState: (payload && immutable.assign(state, path, payload as any)) || state,
            originalState: get(state, path),
            isCurrent: true
        };
    }
};

