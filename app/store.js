import { createStore, applyMiddleware } from 'redux';

import React from 'react'
import { toast } from 'react-toastify';

import stateDecorator from './components/redux/middleware/stateDecorator';
import notification from './components/redux/middleware/notification';

import rootReducer from './reducers';

import servicesExample from "./components/api/__dummy__/example";
import servicesAuth from "./components/api/auth";

const getStore = (preloadedState = {}) => createStore(
    rootReducer,
    preloadedState,
    applyMiddleware(
        // promiseMiddleware,
        stateDecorator({ dependencies: { inject: {services: {...servicesExample, ...servicesAuth} } } }),
        notification({
            notify: (
                {error: { message, code, status }, type, cancel, retry}
            ) => {
                if (process.browser && (!status || status >= 500)) {
                    let retrying = false;

                    toast(
                        <div>
                            <p>
                                {message}
                            </p>
                            <p>
                                <small>
                                    {`REF: ${[(code || type), status].filter(value => value).join("-")}`}
                                </small>
                            </p>
                            <p
                                className="text-right"
                            >
                                {cancel
                                && (
                                    <button
                                    >
                                        Cancel
                                    </button>
                                )}
                                {' '}
                                {retry
                                && (
                                    <button
                                        onClick={() => {
                                            retrying = true;
                                        }}
                                    >
                                        Retry
                                    </button>
                                )}
                            </p>
                        </div>,
                        {
                            autoClose: !(cancel || retry),
                            type: 'error',
                            onClose: () => {
                                if (!retrying && cancel) {
                                    cancel();
                                } else if (retry) {
                                    retry();
                                }
                            },
                        },
                    );

                    return true;
                }

                return false;
            },
        }),
        // thunkMiddleware,
        // loggerMiddleware,
    ),
);

export default getStore;
