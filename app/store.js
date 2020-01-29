import { createStore, applyMiddleware, compose } from "redux";
import createSagaMiddleware from "redux-saga";

// import stateDecorator from "components/redux/middleware/stateDecorator";
// import notification from "components/redux/middleware/notification";

import rootReducer from "./reducers";

// import servicesExample from "./components/api/__dummy__/example";
// import servicesAuth from "./components/api/auth";
import {asyncAction} from "./saga";
import promiseDecorator from "components/redux/middleware/promiseDecorator";

const composeEnhancers = (typeof window !== "undefined" && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) || compose;

const sagaMiddleware = createSagaMiddleware();

const rootSaga = function* rootSaga() {
    yield asyncAction();
};

const getStore = (initialState = {}) => {
    const store = createStore(
        rootReducer,
        initialState,
        composeEnhancers(applyMiddleware(
            promiseDecorator,
            sagaMiddleware,

            // promiseMiddleware(),
            // stateDecorator({ dependencies: { services: {...servicesExample, ...servicesAuth} } }),
            // thunkMiddleware,
            // loggerMiddleware,
        )),
    );

    sagaMiddleware.run(rootSaga);

    return store;
};

export default getStore;
