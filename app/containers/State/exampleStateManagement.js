import React, {useCallback, useContext, useEffect, useState} from "react";

export const createAction = (type, payloadCreator) => {
    const action = (...args) => ({
        type,
        payload: payloadCreator.apply(null, args)
    });

    action.type = type;

    return action;
};

export const createReducer = reducers => (state, action) => {
    const reducer = reducers[action.type];
    return (reducer && reducer(state, action)) || state;
};

export const getType = creator => creator.type;

const middlewareExecutor = middleware => (action, done) => [...middleware].reverse().reduce((dispatch, middleware) => {
    return action => middleware(action, action => {
        console.log(`%c${middleware.name}`, "color:#000;background-color:orange;padding: 2px 4px;border-radius:1em;", action);
        return dispatch(action);
    });
}, done)(action);

export const getStore = (initialState, reducers, middleware = []) => {
    let callbacks = [];

    const execMiddleware = middlewareExecutor(middleware);

    let state = {...initialState};

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
                    callbacks.forEach(cb => cb(newState, state));
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
        getState: () => state
    };
};

const StoreContext = React.createContext(undefined);

export const StoreProvider = StoreContext.Provider;

export const connect = (mapStateToProps, mapDispatchToProps) => {
    return Component => () => {
        const store = useContext(StoreContext);

        const state = store.getState();

        const actions = useCallback(mapDispatchToProps(store.dispatch), [mapDispatchToProps]);

        const [props, setProps] = useState(mapStateToProps(state));

        useEffect(() => {
            const cb = (state, prevState) => {
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
};

// - Example middleware --------------------------------------------------------------------------------------------------------------------

export const simplePromiseDecorator = async (action, next) => {
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

export const simpleAsyncDecorator = (action, next) => {
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

export const simpleDecorator = (action, next) => {
    next({
        ...action,
        meta: {
            ...action.meta,
            simpleDecorator: true
        }
    });
};

