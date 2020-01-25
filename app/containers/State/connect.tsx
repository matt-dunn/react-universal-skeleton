// - React bindings --------------------------------------------------------------------------------------------------------------------

import React, {ReactNode, useCallback, useContext, useEffect, useState} from "react";
import {StandardAction, GetStore, Dispatcher} from "./exampleStateManagement";
import {InferableComponentEnhancerWithProps} from "./utils";

type StoreProvider<S, A extends StandardAction = any> = {
    store: GetStore<S, A>;
    children: ReactNode;
}

type MapStateToProps<S, TState> = {
    (state: TState): S;
}

type MapDispatchToProps<S, A extends StandardAction = any> = {
    (dispatch: Dispatcher<A>): S;
}

const StoreContext = React.createContext<GetStore<any, any>>({} as GetStore<any>);

export const StoreProvider = <S, A extends StandardAction = any>({store, children}: StoreProvider<S, A>) =>
    <StoreContext.Provider value={store}>{children}</StoreContext.Provider>;

export function connect<TOwnProps = {}, TStateProps = {}, TDispatchProps = {}, TState = {}>(
    mapStateToProps: MapStateToProps<TStateProps, TState>,
    mapDispatchToProps: MapDispatchToProps<TDispatchProps>
): InferableComponentEnhancerWithProps<TStateProps & TDispatchProps, TOwnProps> {
    return Component => ownProps => {
        const store = useContext<GetStore<TState>>(StoreContext);

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
