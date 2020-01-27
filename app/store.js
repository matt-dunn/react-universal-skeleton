import { createStore, applyMiddleware, compose } from "redux";
import createSagaMiddleware from "redux-saga";
import { call, put, takeEvery, takeLatest, cancelled } from "redux-saga/effects";

import stateDecorator from "components/redux/middleware/stateDecorator";
import notification from "components/redux/middleware/notification";

import rootReducer from "./reducers";

import servicesExample from "./components/api/__dummy__/example";
import servicesAuth from "./components/api/auth";

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const sagaMiddleware = createSagaMiddleware();

const getStore = (initialState = {}) => {
    const store = createStore(
        rootReducer,
        initialState,
        // window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),
        composeEnhancers(applyMiddleware(
            // promiseMiddleware,
            stateDecorator({ dependencies: { services: {...servicesExample, ...servicesAuth} } }),
            notification({notify: () => import("./notify").then(module => module.notify)}),
            sagaMiddleware,
            // thunkMiddleware,
            // loggerMiddleware,
        )),
    );

    sagaMiddleware.run(mySaga);

    return store;
};

import {exampleActions} from "app/actions";
import {getType} from "typesafe-actions";
import uuid from "uuid";

const Api = {
    fetchUser: userId => {
        console.error("***userId", userId);
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve([{
                    a: 42
                }]);
            }, 2000);
        });
    }
};

const canceller = function() {
    let c;
    return {
        on: cb => c = cb,
        cancelled: () => c && c()
    };
};

function* callAsyncWithCancel(action) {
    const transactionId = uuid.v4();
    const cancel = canceller();

    try {
        yield put({
            ...action,
            meta: {
                $status: {
                    transactionId,
                    processing: true
                }
            }
        });
        const user = yield call(servicesExample.exampleGetList, action.payload.page, action.payload.count, cancel);
        yield put({
            ...action,
            payload: user,
            meta: {
                $status: {
                    transactionId,
                    processing: false,
                    complete: true
                }
            }
        });
    } catch (error) {
        yield put({
            ...action,
            meta: {
                $status: {
                    transactionId,
                    processing: false,
                    complete: false,
                    hasError: true,
                    error
                }
            }
        });
    } finally {
        if (yield cancelled()) {
            cancel.cancelled();

            yield put({
                ...action,
                meta: {
                    $status: {
                        transactionId,
                        processing: false,
                        complete: false,
                        cancelled: true
                    }
                }
            });
        }
    }
}

function* mySaga() {
    yield takeLatest(action => (action.type === "@__dummy__/EXAMPLE_GET_LIST" && !action?.meta?.$status), callAsyncWithCancel);
}


export default getStore;
