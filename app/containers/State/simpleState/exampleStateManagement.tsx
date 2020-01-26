export type StandardAction<P = any, M = any> = {
    type: string;
    payload?: P;
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

type Reducer<P = any, M = any, S = any, A extends StandardAction<P, M> = StandardAction<P, M>> = {
    (state: S, action: A): S;
}

type Reducers<P = any, M = any, S = any, A extends StandardAction<P, M> = StandardAction<P, M>> = {
    [type: string]: Reducer<P, M, S, A>;
};

export type Dispatcher<A extends StandardAction = StandardAction> = {
    (action: A): void;
};

export type Middleware<P = any, M = any, A extends StandardAction<P, M> = any> = {
    (action: A, next: Dispatcher<A>): void;
}

type Callback<S> = {
    (newState: S, state: S): void;
}

type State<S> = {
    [key: string]: Partial<S>;
}

export type GetStore<S, A extends StandardAction = StandardAction> = {
    dispatch: Dispatcher<A>;
    register: (cb: Callback<S>) => void;
    unregister: (cb: Callback<S>) => void;
    getState: () => S;
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

const middlewareExecutor = <P, M, S, A extends StandardAction<P, M>>(middleware: Middleware[]) =>
    (action: A, done: Dispatcher<A>) =>
        [...middleware].reverse().reduce((dispatch, middleware) => {
            return action => middleware(action, action => {
                console.log(`%c${middleware.name}`, "color:#000;background-color:orange;padding: 2px 4px;border-radius:1em;", action);
                return dispatch(action);
            });
        }, done)(action);

export const getStore = <S extends {}, P, M, A extends StandardAction<P, M>>(initialState: S, reducers: Reducers, middleware: Middleware[] = []): GetStore<S, A> => {
    const execMiddleware = middlewareExecutor(middleware);

    let callbacks: Callback<S>[] = [];

    let state: State<S> = {...initialState};

    return {
        dispatch: action => {
            execMiddleware(action, action => {
                const nextState = Object.keys(reducers).reduce((state, key) => {
                    const nextState = reducers[key](state[key], action);

                    if (nextState !== state[key]) {
                        state = {
                            ...state,
                            [key]: nextState
                        };
                    }

                    return state;
                }, state);

                if (nextState !== state) {
                    callbacks.forEach(cb => cb(nextState as S, state as S));
                    state = nextState;
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
