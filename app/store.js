import { createStore, applyMiddleware } from 'redux';

import React from 'react';

import {notify} from "./notify";
import stateDecorator from 'components/redux/middleware/stateDecorator';
import notification from 'components/redux/middleware/notification';

import rootReducer from './reducers';

import servicesExample from "./components/api/__dummy__/example";
import servicesAuth from "./components/api/auth";

const getStore = (initialState = {}) => createStore(
    rootReducer,
    initialState,
    applyMiddleware(
        // promiseMiddleware,
        stateDecorator({ dependencies: { inject: {services: {...servicesExample, ...servicesAuth} } } }),
        notification({notify}),
        // thunkMiddleware,
        // loggerMiddleware,
    ),
);

export default getStore;
