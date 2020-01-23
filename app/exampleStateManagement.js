import React, {useEffect, useState} from "react";

const middlewareExecutor = middleware => (action, done) => [...middleware].reverse().reduce((dispatch, middleware) => {
    return action => middleware(action, action => {
        console.log(`%c${middleware.name}`, "color:#000;background-color:orange;padding: 2px 4px;border-radius:1em;", action)
        return dispatch(action)
    })
}, done)(action);

export const getStore = (initialState, reducers, middleware = []) => {
    const callbacks = [];

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
        register: cb => callbacks.push(cb),
        getState: () => state
    };
};

export const connect = (store, mapStateToProps, mapDispatchToProps) => {
    const state = store.getState();

    const actions = mapDispatchToProps(store.dispatch)

    return Component => () => {
        const [props, setProps] = useState(mapStateToProps(state))

        useEffect(() => {
            store.register((state, prevState) => {
                console.group("STATE CHANGE");
                console.error("state", state);
                console.error("prevState", prevState);
                console.error("changed", state !== prevState);
                console.groupEnd();

                setProps(mapStateToProps(state))
            });
        }, [])

        return React.createElement(Component, {
            ...props,
            ...actions
        })
    }
}

// - Example middleware --------------------------------------------------------------------------------------------------------------------

export const simplePromiseDecorator = async (action, next) => {
    if (action.payload && action.payload.then && action.payload.catch) {
        next({
            ...action,
            payload: {
                $status: {
                    processing: true
                }
            },
            meta: {
                processing: true,
                complete: false
            }
        });

        next({
            ...action,
            payload: {
                ...await action.payload,
                $status: {
                    processing: false
                }
            },
            meta: {
                processing: false,
                complete: true
            }
        });
    } else {
        next(action);
    }
}

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
}

export const simpleDecorator = (action, next) => {
    next({
        ...action,
        meta: {
            ...action.meta,
            simpleDecorator: true
        }
    });
}

