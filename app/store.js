import { createStore, applyMiddleware } from 'redux';

import stateDecorator from './components/redux/middleware/stateDecorator';
import notification from './components/redux/middleware/notification';

import rootReducer from './reducers';

const store = createStore(
    rootReducer,
    applyMiddleware(
        // promiseMiddleware,
        stateDecorator({ loadingState: { include: true, timeout: 500 }, dependencies: {  } }),
        notification({
            notify: ({
                         error: { message, code }, type, cancel, retry,
                     }) => {
                if (message !== 'Whoops') {
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
                                    <Button
                                        size="sm"
                                        color="primary"
                                    >
                                        Cancel
                                    </Button>
                                )}
                                {' '}
                                {retry
                                && (
                                    <Button
                                        size="sm"
                                        onClick={() => {
                                            retrying = true;
                                        }}
                                    >
                                        Retry
                                    </Button>
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

export default store;
