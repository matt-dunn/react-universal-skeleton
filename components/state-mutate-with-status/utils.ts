import isEqual from "lodash/isEqual";
import { get, isObject } from "lodash";
import immutable from "object-path-immutable";

import {Options, Path, Status, MetaStatus, symbolActiveTransactions, symbolStatus} from "./";

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

    const updatedStatus = Status({
        error: status.error,
        ...metaStatus,
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

const getSymbolName = (symbol: symbol): string => {
    return `$$${symbol.toString()}`;
};

const convertStatusSymbolToString = (o: any) => {
    if (o && o[symbolStatus]) {
        const c = clone(o);
        c[getSymbolName(symbolStatus)] = o[symbolStatus];
        delete c[symbolStatus];
        return c;
    }
    return o;
};

export const serialize = (o: any): string => {
    return o && JSON.stringify(o, (key: string, v: any) => {
        const value = convertStatusSymbolToString(v);

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

const convertStatusSymbolToSymbol = (o: any) => {
    if (o && o[getSymbolName(symbolStatus)]) {
        const c = clone(o);
        c[symbolStatus] = o[getSymbolName(symbolStatus)];
        delete c[getSymbolName(symbolStatus)];
        return c;
    }
    return o;
};

export const deserialize = (s: string): any => {
    return s && JSON.parse(s, (key, v) => {
        const value = convertStatusSymbolToSymbol(v);
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

export const getPayload = <S extends MetaStatus, P>(metaStatus: S, payload?: P): P | undefined => (!metaStatus.error && payload) || undefined;

export const getUpdatedState = <S, P, U extends MetaStatus>(state: S, payload: P | undefined | null, metaStatus: U, path: Path, actionId?: string, options?: Options<P>): UpdatedStatus<S, P> => {
    if (actionId) {
        const array = get(state, path);

        if (Array.isArray(array)) {
            const index = array.findIndex(item => item.id === actionId);

            if (index === -1 && options?.autoInsert !== false) {
                if (payload) {
                    const { getNewItemIndex } = options || {} as Options<P>;

                    return {
                        updatedState: immutable.insert(state, path, Object.assign({}, payload, {[symbolStatus]: decorateStatus(metaStatus)}), getNewItemIndex ? getNewItemIndex(array, payload) : array.length),
                        originalState: null // Ensure final payload is not set so this item can be removed from the array on failure
                    };
                }
            } else if (payload === null && options?.autoDelete !== false) {
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

