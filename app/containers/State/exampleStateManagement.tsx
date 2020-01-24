import React, {
    useCallback,
    useContext,
    useEffect,
    useState,
    ReactNode,
    FunctionComponent,
    ComponentClass
} from "react";

export type StandardAction<P = any, M = any> = {
    type: string;
    payload: P;
    meta?: M;
    error?: boolean;
}

type ActionCreator<P = any, M = any, A extends any[] = any[]> = {
    (...args: A): StandardAction<P, M>;
    type: string;
}

type PayloadCreator<P = any, M = any, A extends any[] = any[]> = {
    (...args: A): P;
}

type Reducer<P = any, M = any, S = any, A extends StandardAction<P, M> = any> = {
    (state: S, action: A): S;
}

type Reducers<P = any, M = any, S = any, A extends StandardAction<P, M> = any> = {
    [type: string]: Reducer<P, M, S, A>;
};

type Dispatcher<A> = (action: A) => void;

type Middleware<P = any, M= any, A extends StandardAction<P, M> = any> = {
    (action: A, next: Dispatcher<A>): void;
}

type Callback<S> = {
    (newState: S, state: S): void;
}

type State<S> = {
    [key: string]: Partial<S>;
}

type GetStore<S, A> = {
    dispatch: Dispatcher<A>;
    register: (cb: Callback<S>) => void;
    unregister: (cb: Callback<S>) => void;
    getState: () => S;
}

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



export const createAction = <P, M, A extends any[] = any[]>(type: string, payloadCreator: PayloadCreator<P, M, A>): ActionCreator<P, M, A> => {
    const action = (...args: A): StandardAction<P, M> => ({
        type,
        payload: payloadCreator(...args)
    });

    action.type = type;

    return action;
};

export const createReducer = <P, M, S, A extends StandardAction<P, M>>(reducers: Reducers<P, M, S, A>) => (state: S, action: A) => {
    const reducer = reducers[action.type];
    return (reducer && reducer(state, action)) || state;
};

export const getType = <P, M, A extends any[] = any[]>(creator: ActionCreator<P, M, A>) => creator.type;

const middlewareExecutor = <P, M, S, A extends StandardAction<P, M>>(middleware: Middleware<P, A>[]) =>
    (action: A, done: Dispatcher<A>) =>
        [...middleware].reverse().reduce((dispatch, middleware) => {
            return action => middleware(action, action => {
                console.log(`%c${middleware.name}`, "color:#000;background-color:orange;padding: 2px 4px;border-radius:1em;", action);
                return dispatch(action);
            });
        }, done)(action);

export const getStore = <S extends {}, P, M, A extends StandardAction<P, M>>(initialState: S, reducers: Reducers, middleware: Middleware[] = []): GetStore<S, A> => {
    let callbacks: Callback<S>[] = [];

    const execMiddleware = middlewareExecutor(middleware);

    let state: State<S> = {...initialState};

    return {
        dispatch: action => {
            execMiddleware(action, action => {
                const newState = Object.keys(reducers).reduce((state, key) => {
                    const newState = reducers[key](state[key], action);

                    if (newState !== state[key]) {
                        state = {
                            ...state,
                            [key]: newState
                        };
                    }

                    return state;
                }, state);

                if (newState !== state) {
                    callbacks.forEach(cb => cb(newState as S, state as S));
                    state = newState;
                }
            });

            return action.payload;
        },
        register: cb => {
            callbacks = [...callbacks, cb];
        },
        unregister: cb => {
            callbacks = callbacks.filter(callback => callback !== cb);
        },
        getState: () => state as S
    };
};

// - React bindings --------------------------------------------------------------------------------------------------------------------

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
            const cb = (state: S, prevState: S) => {
                console.group("STATE CHANGE");
                console.error("state", state);
                console.error("prevState", prevState);
                console.error("changed", state !== prevState);
                console.groupEnd();

                setProps(mapStateToProps(state));
            };

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

// - Example middleware --------------------------------------------------------------------------------------------------------------------

export const simplePromiseDecorator: Middleware = async (action, next) => {
    if (action.payload && action.payload.then && action.payload.catch) {
        try {
            next({
                ...action,
                payload: {
                    $status: {
                        processing: true,
                        complete: false,
                    }
                }
            });

            next({
                ...action,
                payload: {
                    ...await action.payload,
                    $status: {
                        processing: false,
                        complete: true
                    }
                }
            });
        } catch(error) {
            next({
                ...action,
                payload: {
                    $status: {
                        processing: false,
                        complete: false,
                        error: error.message
                    }
                },
                error: true
            });
        }
    } else {
        next(action);
    }
};

export const simpleAsyncDecorator: Middleware = (action, next) => {
    setTimeout(() => {
        next({
            ...action,
            meta: {
                ...action.meta,
                simpleAsyncDecorator: true
            }
        });
    }, 1000);
};

export const simpleDecorator: Middleware = (action, next) => {
    next({
        ...action,
        meta: {
            ...action.meta,
            simpleDecorator: true
        }
    });
};

