import { createStore, applyMiddleware, compose } from "redux";
import createSagaMiddleware from "redux-saga";
import {fork} from "redux-saga/effects";

import {sagaAsyncAction} from "components/redux/middleware/sagaAsyncAction";
import { payloadCreator } from "components/redux/middleware/payloadCreator";
import {sagaNotification} from "components/redux/middleware/sagaNotification";
import {APIContext} from "components/api";

import rootReducer from "./reducers";

import {API, APIOptions} from "./components/api";

const composeEnhancers = (typeof window !== "undefined" && (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) || compose;

const getStore = (initialState = {}, options: APIOptions, context?: APIContext) => {
    const rootSaga = function* rootSaga() {
        yield fork(sagaNotification, notification => import("./notify").then(({notify}) => notify(notification)));
        yield fork(sagaAsyncAction);
    };

    const sagaMiddleware = createSagaMiddleware();

    const store = createStore(
        rootReducer,
        initialState,
        composeEnhancers(applyMiddleware(
          payloadCreator({API: API(options, context)}),
            sagaMiddleware
        )),
    );

    sagaMiddleware.run(rootSaga);

    return store;
};

export default getStore;
