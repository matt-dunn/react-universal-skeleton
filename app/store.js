import { createStore, applyMiddleware } from 'redux';

import React from 'react'
import { toast } from 'react-toastify';

import stateDecorator from './components/redux/middleware/stateDecorator';
import notification from './components/redux/middleware/notification';

import rootReducer from './reducers';

import services from "./components/api/__dummy__/example";

const getStore = (preloadedState = {}) => createStore(
    rootReducer,
    preloadedState,
    applyMiddleware(
        // promiseMiddleware,
        stateDecorator({ dependencies: { inject: {services } } }),
        notification({
            notify: (
                {error: { message, code }, type, cancel, retry}
            ) => {
                if (process.browser && message !== 'Whoops') {
                    let retrying = false;

                    toast(
                        <div>
                            <p>
                                {message}
                            </p>
                            <p>
                                <small>
                                    REF:
                                    {' '}
                                    {code || type}
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
