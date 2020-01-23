const middlewareExecutor = middleware => (action, done) => [...middleware].reverse().reduce((dispatch, middleware) => {
    return action => middleware(action, action => dispatch(action));
}, done)(action);

const getStore = (initialState, reducers, middleware = []) => {
    const callbacks = [];

    const execMiddleware = middlewareExecutor(middleware);

    let state = Object.assign({}, initialState);

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

// - Example reducers --------------------------------------------------------------------------------------------------------------------
const exampleReducer = (state, {type, payload}) => {
    switch (type) {
        case "SIMPLE_ASYNC_ACTION": {
            return {
                ...state,
                asyncData: payload
            };
        }
        case "SIMPLE_SYNC_ACTION": {
            return {
                ...state,
                syncData: payload
            };
        }
        default: {
            return state;
        }
    }
};

// - Example action creators --------------------------------------------------------------------------------------------------------------------
const simpleAsyncAction = id => ({
    type: "SIMPLE_ASYNC_ACTION",
    payload: new Promise(resolve => {
        setTimeout(() => {
            resolve({
                id,
                data: `Async data for ${id}`
            });
        }, 4000);
    })
});

const simpleSyncAction = id => ({
    type: "SIMPLE_SYNC_ACTION",
    payload: {id, data: `Sync data for ${id}`}
});

// - Example middleware --------------------------------------------------------------------------------------------------------------------
const middleware = [
    async (action, next) => {
        console.error(">>1", action);
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
    },
    (action, next) => {
        console.error(">>2", action);
        setTimeout(() => {
        next({
            ...action,
            meta: {
                ...action.meta,
                some: true
            }
        });
        }, 1000);
    },
    (action, next) => {
        console.error(">>3", action);

        // setTimeout(() => {
        next({
            ...action,
            meta: {
                ...action.meta,
                more: true
            }
        });
        // }, 2000);
    },
    (action, next) => {
        console.error(">>4", action);
        // setTimeout(() => {
        next({
            ...action,
            meta: {
                ...action.meta,
                another: true
            }
        });
        // }, 2000);
    }
];

const rootReducer = {
    someData: exampleReducer
};

const myStore = getStore({}, rootReducer, middleware);

myStore.register((state, prevState) => {
    console.group("STATE CHANGE");
    console.error("state", state);
    console.error("prevState", prevState);
    console.error("changed", state !== prevState);
    console.groupEnd();
});

myStore.dispatch(simpleAsyncAction("123-456"))
    .then(x => {
        console.error("!!!!!", x);
    });

myStore.dispatch(simpleSyncAction("456-789"));
