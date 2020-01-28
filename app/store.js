import { createStore, applyMiddleware, compose } from "redux";

import stateDecorator from "components/redux/middleware/stateDecorator";
import notification from "components/redux/middleware/notification";

import rootReducer from "./reducers";

import servicesExample from "./components/api/__dummy__/example";
import servicesAuth from "./components/api/auth";

const composeEnhancers = (typeof window !== "undefined" && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) || compose;
const getStore = (initialState = {}) => createStore(
    rootReducer,
    initialState,
    // window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),
    composeEnhancers(applyMiddleware(
        // promiseMiddleware,
        stateDecorator({ dependencies: { services: {...servicesExample, ...servicesAuth} } }),
        notification({notify: () => import("./notify").then(module => module.notify)}),
        // thunkMiddleware,
        // loggerMiddleware,
    )),
);

export default getStore;
