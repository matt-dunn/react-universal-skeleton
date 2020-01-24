// - React bindings --------------------------------------------------------------------------------------------------------------------

import React, {ComponentClass, FunctionComponent, ReactNode, useCallback, useContext, useEffect, useState} from "react";
import {StandardAction, GetStore, Dispatcher} from "./exampleStateManagement";

type StoreProvider<S, A> = {
    store: GetStore<S, A>;
    children: ReactNode;
}

type Connect<P> = {
    (Component: FunctionComponent<P> | ComponentClass<P> | string): FunctionComponent<P>;
}

type MapStateToProps<S, P> = {
    (state: S): Partial<P>;
}

type MapDispatchToProps<P, A extends StandardAction = any> = {
    (dispatch: Dispatcher<A>): any;
}

const StoreContext = React.createContext<GetStore<any, any>>({} as GetStore<any, any>);

export const StoreProvider = <S, A>({store, children}: StoreProvider<S, A>) =>
    <StoreContext.Provider value={store}>{children}</StoreContext.Provider>;

export function connect<S, P>(mapStateToProps: MapStateToProps<S, P>, mapDispatchToProps: MapDispatchToProps<P>): Connect<any> {
    return Component => () => {
        const store = useContext<GetStore<S, any>>(StoreContext);

        const state = store.getState();

        const actions = useCallback(mapDispatchToProps(store.dispatch), [mapDispatchToProps]);

        const [props, setProps] = useState(mapStateToProps(state));

        useEffect(() => {
            const cb = (state: S) => setProps(mapStateToProps(state));

            store.register(cb);

            return () => {
                store.unregister(cb);
            };
        }, [store]);

        return React.createElement(Component, {
            ...props,
            ...actions
        });
    };
}
