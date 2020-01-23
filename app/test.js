const defaultState = undefined;

const userReducer = (state = defaultState, action) => {
    switch (action.type) {
        case "GET_USER": {
            return  action.payload;
        }
        default: {
            return state;
        }
    }
};

// const userReducer = {
//     getUserReducer
// }



const state = {
    items: []
};

const getUser = id => ({
    type: "GET_USER",
    // payload: {id, name: "HELLO"}
    payload: new Promise(resolve => {
        setTimeout(() => {
            resolve({
                id,
                name: `User ${id}`
            });
        }, 1000);
    })
});

const middleware = [
    async (action, next) => {
        if (action.payload && action.payload.then && action.payload.catch) {
            // next({
            //     ...action,
            //     meta: {
            //         processing: true
            //     }
            // })

            next({
                ...action,
                payload: {
                    ...await action.payload,
                    $status: {
                        complete: true
                    }
                },
                meta: {
                    async: true
                }
            })
        } else {
            next();
        }
    },
    (action, next) => {
        // setTimeout(() => {
            next({
                ...action,
                meta: {
                    ...action.meta,
                    something: true
                }
            });
        // }, 2000);
    }
];

const execMiddleware = async (middleware, action) => middleware.reduce(async (promise, m) => {
    const action = await promise;

    return new Promise(resolve => {
        m(action, a => resolve(a || action));
    });
}, Promise.resolve(action));

const getStore = (initialState, reducers, middleware = []) => {
    let state = Object.assign({}, initialState);
    const callbacks = [];

    return {
        dispatch: async originalAction => {
            const action = await execMiddleware(middleware, originalAction);

            console.error(">>>FINAL ACTION", action)

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
        },
        register: cb => callbacks.push(cb),
        getState: () => state
    };
};

const rootReducer = {
    user: userReducer
};

const myStore = getStore({}, rootReducer, middleware);

myStore.register((state, prevState) => {
    console.error("STATE CHANGE", state, prevState, state === prevState);
});

const s1 = myStore.getState();

myStore.dispatch(getUser("123-456"));

const s2 = myStore.getState();

console.error("%%%%%", s1 === s2, s1, s2);

// myStore.dispatch(getUser("123-456-789"))

// console.error(userReducer({}, getUser("123-456")))
