// - React bindings --------------------------------------------------------------------------------------------------------------------

import React, {ReactNode, useCallback, useContext, useEffect, useState} from "react";

import {GetStore, Dispatcher} from "./getStore";
import {InferableComponentEnhancerWithProps} from "./utils";

type StoreProvider<S> = {
    store: GetStore<S>;
    children: ReactNode;
}

type MapStateToProps<TStateProps, TState> = {
    (state: TState): TStateProps;
}

type MapDispatchToProps<S> = {
    (dispatch: Dispatcher): S;
}

const StoreContext = React.createContext<GetStore<any, any>>({} as GetStore<any>);

export const StoreProvider = <S extends {}>({store, children}: StoreProvider<S>) =>
    <StoreContext.Provider value={store}>{children}</StoreContext.Provider>;

export function connect<TOwnProps = {}, TStateProps = {}, TDispatchProps = {}, TState = {}>(
    mapStateToProps: MapStateToProps<TStateProps, TState>,
    mapDispatchToProps: MapDispatchToProps<TDispatchProps>
): InferableComponentEnhancerWithProps<TStateProps & TDispatchProps, TOwnProps> {
    return Component => ownProps => {
        const store = useContext(StoreContext);

        const actions = useCallback<any>(mapDispatchToProps(store.dispatch), [mapDispatchToProps]);

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
        });
    };
}
