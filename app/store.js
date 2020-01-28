import { createStore, applyMiddleware, compose } from "redux";
import createSagaMiddleware from "redux-saga";
import { call, takeLatest } from "redux-saga/effects";

import stateDecorator from "components/redux/middleware/stateDecorator";
import notification from "components/redux/middleware/notification";

import rootReducer from "./reducers";

import servicesExample from "./components/api/__dummy__/example";
import servicesAuth from "./components/api/auth";
import {callAsyncWithCancel, createPattern} from "./saga";

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const sagaMiddleware = createSagaMiddleware();

const getStore = (initialState = {}) => {
    const store = createStore(
        rootReducer,
        initialState,
        // window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),
        composeEnhancers(applyMiddleware(
            // promiseMiddleware,
            sagaMiddleware,
            stateDecorator({ dependencies: { services: {...servicesExample, ...servicesAuth} } }),
            notification({notify: () => import("./notify").then(module => module.notify)}),
            // thunkMiddleware,
            // loggerMiddleware,
        )),
    );

    sagaMiddleware.run(mySaga);

    return store;
};


function* mySaga() {
    yield takeLatest(
        createPattern( "@__dummy__/EXAMPLE_GET_LIST"),
        callAsyncWithCancel,
        ({meta: {params: {page, count}}}, cancel) => call(servicesExample.exampleGetList, page, count, cancel)
    );
}


export default getStore;
