import { createStore, applyMiddleware, compose } from "redux";
import createSagaMiddleware from "redux-saga";
import {fork} from "redux-saga/effects";

import {sagaAsyncAction} from "components/redux/middleware/sagaAsyncAction";
import {promiseDecorator} from "components/redux/middleware/promiseDecorator";
import {sagaNotification} from "components/redux/middleware/sagaNotification";

import rootReducer from "./reducers";

import {API} from "./components/api";

const composeEnhancers = (typeof window !== "undefined" && (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) || compose;

const rootSaga = function* rootSaga() {
    yield fork(sagaNotification, notification => import("./notify").then(({notify}) => notify(notification)));
    yield fork(sagaAsyncAction, {API});
};

const getStore = (initialState = {}) => {
    const sagaMiddleware = createSagaMiddleware();

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
