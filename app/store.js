import { createStore, applyMiddleware, compose } from "redux";
import createSagaMiddleware from "redux-saga";

import {sagaAsyncAction} from "components/redux/middleware/sagaAsyncAction";
import promiseDecorator from "components/redux/middleware/promiseDecorator";

import rootReducer from "./reducers";

import api from "./components/api";

const composeEnhancers = (typeof window !== "undefined" && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) || compose;

const sagaMiddleware = createSagaMiddleware();

const rootSaga = function* rootSaga() {
    yield sagaAsyncAction(api);
};

const getStore = (initialState = {}) => {
    const store = createStore(
        rootReducer,
        initialState,
        composeEnhancers(applyMiddleware(
            promiseDecorator,
            sagaMiddleware
        )),
    );

    sagaMiddleware.run(rootSaga);

    return store;
};

export default getStore;
