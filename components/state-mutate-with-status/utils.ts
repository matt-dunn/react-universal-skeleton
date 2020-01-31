import isEqual from "lodash/isEqual";
import { get, isObject } from "lodash";
import immutable from "object-path-immutable";

import {Status, MetaStatus, symbolActiveTransactions, symbolStatus} from "./status";
import {Options, Path} from "./";

type UpdatedStatus<S, P> = {
    updatedState: S;
    originalState?: P | null;
    isCurrent?: boolean;
}

export const decorateStatus = (metaStatus: MetaStatus, status: Status = {} as Status, isCurrent = true): Status => {
    const activeTransactions = { ...status[symbolActiveTransactions] };

    if (metaStatus.processing) {
        activeTransactions[metaStatus.transactionId] = isCurrent;
    } else {
        delete activeTransactions[metaStatus.transactionId];
    }

    const hasActiveTransactions = activeTransactions && Object.keys(activeTransactions).length > 0;

    const updatedStatus = Status({
        ...metaStatus,
        complete: !hasActiveTransactions,
        processing: activeTransactions[metaStatus.transactionId] === true,
        [symbolActiveTransactions]: activeTransactions,
    });

    if (isEqual(updatedStatus, status)) {
        return status;
    }

    return updatedStatus;
};

const clone = (o: any) => {
    if (Array.isArray(o)) {
        return [...o];
    } else if (isObject(o)) {
        return {...o};
    }
    return o;
};

const stringifySymbols = (o: any) => {
    if (o && o[symbolStatus]) {
        const c = clone(o);
        c[symbolStatus.toString()] = o[symbolStatus];
        delete c[symbolStatus];
        return c;
    }
    return o;
};

export const serialize = (o: any): string => {
    return o && JSON.stringify(o, (key: string, v: any) => {
        const value = stringifySymbols(v);

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

const parseSymbols = (o: any) => {
    if (o && o[symbolStatus.toString()]) {
        const c = clone(o);
        c[symbolStatus] = o[symbolStatus.toString()];
        delete c[symbolStatus.toString()];
        return c;
    }
    return o;
};

export const deserialize = (s: string): any => {
    return s && JSON.parse(s, (key, v) => {
        const value = parseSymbols(v);
        if (value && value.$$arr) {
            const {$: array = [], _: values} = value.$$arr;

            values && Object.getOwnPropertyNames(values).concat(Object.getOwnPropertySymbols(values) as unknown as string[]).forEach(key => {
                array[key] = values[key];
            });

            return array;
        }
        return value;
    });
};

export const getPayload = <S extends MetaStatus, P>(metaStatus: S, payload?: P): P | undefined => payload;

export const getUpdatedState = <S, P, U extends MetaStatus>(state: S, payload: P | undefined | null, metaStatus: U, path: Path, actionId?: string, options?: Options<P>): UpdatedStatus<S, P> => {
    if (actionId) {
        const array = get(state, path);

        if (Array.isArray(array)) {
            const index = array.findIndex(item => item.id === actionId);

            if (index === -1) {
                if (payload) {
                    const { getNewItemIndex } = options || {} as Options<P>;

                    return {
                        updatedState: immutable.insert(state, path, Object.assign({}, payload, {[symbolStatus]: decorateStatus(metaStatus)}), getNewItemIndex ? getNewItemIndex(array, payload) : array.length),
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
                        state => decorateStatus(metaStatus, state && state[symbolStatus])
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

