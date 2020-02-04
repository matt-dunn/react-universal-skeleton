// - React bindings --------------------------------------------------------------------------------------------------------------------

import React, {ReactNode, useMemo, useContext, useEffect, useState} from "react";
import {isFunction, isObject} from "lodash";

import {GetStore, Dispatcher} from "./getStore";
import {InferableComponentEnhancerWithProps} from "./utils";

type StoreProvider<S> = {
    store: GetStore<S>;
    children: ReactNode;
}

type MapStateToProps<TStateProps, TState> = {
    (state: TState): TStateProps;
}

type MapDispatchToPropsFunction<S> = {
    (dispatch: Dispatcher): S;
}

type MapDispatchToProps<S> = S & DispatchMap

type MapDispatch<S> = MapDispatchToProps<S> | MapDispatchToPropsFunction<S>

const StoreContext = React.createContext<GetStore<any, any>>({} as GetStore<any>);

type DispatchMap = {
    [key: string]: (...args: any[]) => any;
}

function isMapDispatchToPropsFunction<T>(arg: any): arg is MapDispatchToPropsFunction<T> {
    return isFunction(arg);
}

function isMapDispatchToProps<T>(arg: any): arg is MapDispatchToProps<T> {
    return isObject(arg);
}

export const StoreProvider = <S extends {}>({store, children}: StoreProvider<S>) =>
    <StoreContext.Provider value={store}>{children}</StoreContext.Provider>;

export function connect<TOwnProps = {}, TStateProps = {}, TDispatchProps = {}, TState = {}>(
    mapStateToProps: MapStateToProps<TStateProps, TState>,
    mapDispatchToProps: MapDispatch<TDispatchProps>
): InferableComponentEnhancerWithProps<TStateProps & TDispatchProps, TOwnProps> {
    return Component => ownProps => {
        const store = useContext(StoreContext);

        const actions = useMemo(
            () =>
                (isMapDispatchToPropsFunction(mapDispatchToProps) && mapDispatchToProps(store.dispatch)) ||
                (isMapDispatchToProps(mapDispatchToProps) && Object.keys(mapDispatchToProps).reduce((actions, key) => {
                    actions[key] = (...args: any[]) => store.dispatch(mapDispatchToProps[key](...args));
                    return actions;
                }, {} as DispatchMap)),
            [store]
        );

        const [props, setProps] = useState(mapStateToProps(store.getState()));

        useEffect(() => {
            const cb = (state: TState) => setProps(mapStateToProps(state));

            store.register(cb);

            return () => {
                store.unregister(cb);
            };
        }, [store]);

        return React.createElement(Component, {
            ...ownProps,
            ...props,
            ...actions
        } as any);
    };
}
