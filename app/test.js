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
}

// const userReducer = {
//     getUserReducer
// }



const state = {
    items: []
}

const getUser = id => ({
    type: "GET_USER",
    // payload: {id, name: "HELLO"}
    payload: new Promise(resolve => {
        setTimeout(() => {
            resolve({
                id,
                name: `User ${id}`
            });
        }, 1000)
    })
})

const middleware = [
    // (action, next) => {
    //     console.error("@@ACTION", action, next)
    //     if (action.payload && action.payload.then && action.payload.catch) {
    //         action.payload.then(next)
    //     } else {
    //         setTimeout(() => {
    //             next()
    //         }, 2000)
    //     }
    // },
    // (action, next) => {
    //     console.error("@@ACTION", action, next)
    //     if (action.payload && action.payload.then && action.payload.catch) {
    //         action.payload.then(next)
    //     } else {
    //         setTimeout(() => {
    //             next({
    //                 ...action.payload,
    //                 size: 42
    //             })
    //         }, 2000)
    //     }
    // }
]

const getStore2 = (initialState, reducers, middleware = []) => {
    let state = Object.assign({}, initialState);
    const callbacks = [];

    return {
        dispatch: action => {

            const p = middleware.reduce((promise, m) => {
                return promise.then(payload => {
                    console.error("!!!", payload)

                    return new Promise(resolve => {
                        m({
                            ...action,
                            payload
                        }, p => resolve(p || payload))
                    });
                })
            }, Promise.resolve(action.payload))

            p.then(payload => {
                const newState = Object.keys(reducers).reduce((state, key) => {
                    const newState = reducers[key](state[key], {
                        ...action,
                        payload
                    });
                    if (newState !== state[key]) {
                        state = {
                            ...state,
                            [key]: newState
                        };
                    }
                    return state;
                }, state)

                if (newState !== state) {
                    callbacks.forEach(cb => cb(newState, state))
                    state = newState;
                }
            })

        },
        register: cb => callbacks.push(cb),
        getState: () => state
    }
}

const rootReducer = {
    user: userReducer
}

const myStore = getStore2({}, rootReducer, middleware);

myStore.register((state, prevState) => {
    console.error("STATE CHANGE", state, prevState, state === prevState)
})

const s1 = myStore.getState()

myStore.dispatch(getUser("123-456"))

const s2 = myStore.getState()

console.error("%%%%%", s1 === s2, s1, s2)

// myStore.dispatch(getUser("123-456-789"))

// console.error(userReducer({}, getUser("123-456")))
