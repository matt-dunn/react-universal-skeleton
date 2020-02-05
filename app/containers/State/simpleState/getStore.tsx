export type StandardAction<P = any, M = any> = {
    type: string;
    payload?: P;
    meta?: M;
    error?: boolean;
}

type Reducer<P = any, M = any, S = any, A extends StandardAction<P, M> = StandardAction<P, M>> = {
    (state: S, action: A): S;
}

export type Reducers<P = any, M = any, S = any, A extends StandardAction<P, M> = StandardAction<P, M>> = {
    [type: string]: Reducer<P, M, S, A>;
};

export type Dispatcher<A extends StandardAction = StandardAction> = {
    (action: A): void;
};

export type Middleware<S extends {} = {}, A extends StandardAction = StandardAction, Store extends GetStore<S, A> = GetStore<S, A>> = {
    (store: Store): (next: Dispatcher<A>) => Dispatcher<A>;
}

type Callback<S> = {
    (newState: S, state: S): void;
}

type State<S> = {
    [key: string]: Partial<S>;
}

export type GetStore<S extends {}, A extends StandardAction = StandardAction> = {
    dispatch: Dispatcher<A>;
    subscribe: (cb: Callback<S>) => void;
    unsubscribe: (cb: Callback<S>) => void;
    getState: () => S;
}



const middlewareExecutor = <S extends {}, A extends StandardAction, Store extends GetStore<S, A>>(middleware: Middleware<S, A, Store>[]) =>
    (store: Store, action: A, done: Dispatcher<A>) =>
        [...middleware].reverse().reduce((dispatch, middleware) =>
            action => middleware(store)(action => dispatch(action))(action),
            done
        )(action);

export const getStore = <S extends {}, A extends StandardAction, Store extends GetStore<S, A>>(initialState: S, reducers: Reducers, middleware: Middleware<S, A, Store>[] = []): Store => {
    const execMiddleware = middlewareExecutor(middleware);

    let callbacks: Callback<S>[] = [];

    let state: State<S> = {...initialState};

    const setState = (nextState: State<S>) => {
        if (nextState !== state) {
            callbacks.forEach(cb => cb(nextState as S, state as S));
            state = nextState;
        }
    };

    const store = {
        dispatch: action => {
            execMiddleware(store, action, action => {
                setState(Object.keys(reducers).reduce((state, key) => {
                    const nextStateSlice = reducers[key](state[key], action);

                    if (nextStateSlice !== state[key]) {
                        return {
                            ...state,
                            [key]: nextStateSlice
                        };
                    }

                    return state;
                }, state));
            });

            return action.payload;
        },
        subscribe: cb => {
            callbacks = [...callbacks, cb];
        },
        unsubscribe: cb => {
            callbacks = callbacks.filter(callback => callback !== cb);
        },
        getState: () => state as S
    } as Store;

    return store;
};
