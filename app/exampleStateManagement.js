import React, {useContext, useEffect, useMemo, useState} from "react";
import PropTypes from "prop-types";
import ReactDOM from "react-dom";

// # Store implementation ###############################################

const getStore = (initialState = {}, reducers = {}) => {
    let state = initialState;
    let callbacks = [];

    return {
        dispatch: action => {
            const newState = Object.keys(reducers).reduce((state, key) => {
                const newState = reducers[key](state[key], action);
                if (newState !== state[key]) {
                    return {
                        ...state,
                        [key]: newState
                    };
                }
                return state;
            }, state);

            if (newState !== state) {
                callbacks.forEach(callback => callback(newState, state));
                state = newState;
            }
        },
        getState: () => state,
        register: cb => callbacks = [...callbacks, cb],
        unregister: cb => callbacks = callbacks.filter(callback => callback !== cb)
    };
};

const typeSymbol = Symbol("type");

const createAction = (type, payloadCreator = undefined) => {
    const action = (...args) => ({
        type,
        payload: payloadCreator && payloadCreator(...args)
    });

    action[typeSymbol] = type;

    return action;
};

const getType = actionCreator => actionCreator[typeSymbol];

const createReducer = reducers => {
    return (state, action) => {
        const reducer = reducers[action.type];
        return (reducer && reducer(state, action)) || state;
    };
};

const storeContext = React.createContext(undefined);

const StoreProvider = storeContext.Provider;

const connect = (mapStateToProps, mapDispatchToProps) => {
    return WrappedComponent => props => {
        const store = useContext(storeContext);
        const [state, setState] = useState(store.getState());

        useEffect(() => {
            store.register(setState);

            return () => {
                store.unregister(setState);
            };
        }, [store]);

        const stateProps = useMemo(() => mapStateToProps(state), [state]);

        const dispatchProps = useMemo(() => Object.keys(mapDispatchToProps).reduce((props, key) => {
            props[key] = (...args) => store.dispatch(mapDispatchToProps[key](...args));
            return props;
        }, {}), [store]);

        return <WrappedComponent {...props} {...stateProps} {...dispatchProps}/>;
    };
};








// # Components ###############################################

const Counter = ({count, onIncrease, onDecrease}) => {
    const handleIncrease = () => onIncrease(10);

    const handleDecrease = () => onDecrease(3);

    return (
        <>
            <p>
                The count is {count}.
            </p>
            <button
                onClick={handleDecrease}
            >
                Decrement
            </button>
            <button
                onClick={handleIncrease}
            >
                Increment
            </button>
        </>
    );
};

Counter.propTypes = {
    count: PropTypes.number,
    onIncrease: PropTypes.func,
    onDecrease: PropTypes.func
};

const CounterApp = ({count, increment, decrement, reset, children}) => {
    const handleIncrease = value => increment(value);

    const handleDecrease = value => decrement(value);

    const handleReset = () => reset();

    return (
        <main>
            {children}
            <Counter count={count} onIncrease={handleIncrease} onDecrease={handleDecrease}/>
            <button
                onClick={handleReset}
            >
                Reset
            </button>
        </main>
    );
};

CounterApp.propTypes = {
    count: PropTypes.number,
    increment: PropTypes.func,
    decrement: PropTypes.func,
    reset: PropTypes.func,
    children: PropTypes.element
};



// # Actions ###############################################

const increment = createAction("COUNTER:INCREMENT", (value = 1) => value);

const decrement = createAction("COUNTER:DECREMENT", (value = 1) => value);

const reset = createAction("COUNTER:RESET");



// # Reducers ###############################################

const counterReducers = createReducer({
    [getType(increment)]: (state, {payload}) => ({count: state.count + payload}),
    [getType(decrement)]: (state, {payload}) => ({count: state.count - payload}),
    [getType(reset)]: () => ({count: 0})
});



// # Connected components ###############################################

const ConnectedCounter = connect(
    state => ({
        count: state.counter.count
    }),
    {
        onIncrease: increment,
        onDecrease: decrement
    }
)(Counter);

const ConnectedCounterApp = connect(
    state => ({
        count: state.counter.count
    }),
    {
        increment,
        decrement,
        reset
    }
)(CounterApp);



// # Store setup ###############################################

const initialState = {
    counter: {
        count: 10
    }
};

const rootReducer = {
    counter: counterReducers
};

const store = getStore(initialState, rootReducer);

ReactDOM.render((
    <StoreProvider value={store}>
        <ConnectedCounterApp>
            <ConnectedCounter/>
        </ConnectedCounterApp>
    </StoreProvider>
), document.getElementById("app"));
