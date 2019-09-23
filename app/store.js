import { createStore, applyMiddleware } from 'redux';

import stateDecorator from './components/redux/middleware/stateDecorator';
import notification from './components/redux/middleware/notification';

import rootReducer from './reducers';

window.__INITIAL_STATE__ = {
    example: {
        item: {
            id: '0',
            name: 'Item 0',
        },
        items: [
            {
                id: '1',
                name: 'Item 1',
            },
            {
                id: '2',
                name: 'Item 2',
            },
            {
                id: '3',
                name: 'Item 3',
            },
        ],
    }
};

const store = createStore(
    rootReducer,
    window.__INITIAL_STATE__,
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
