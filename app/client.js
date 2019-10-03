import React, {useEffect} from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import { HelmetProvider } from 'react-helmet-async';
import { BrowserRouter, withRouter } from 'react-router-dom'
import { rehydrateMarks } from 'react-imported-component';
import './.imported';

import { ToastContainer } from 'react-toastify';

import { Provider } from 'react-redux';

import getStore from "./store";

const store = getStore(window.__PRELOADED_STATE__);

console.error(store.getState())

const element = document.getElementById('app')

const ScrollToTop = withRouter(({ children, location: { pathname } }) => {
    useEffect(() => {
        window.scrollTo(0, 0);
        }, [pathname]);

    return children;
});

const app = (
    <HelmetProvider>
        <Provider store={store}>
            <ToastContainer
                hideProgressBar
                pauseOnHover
            />
            <BrowserRouter>
                <ScrollToTop>
                    <App />
                </ScrollToTop>
            </BrowserRouter>
        </Provider>
    </HelmetProvider>
);

if (process.env.NODE_ENV === 'production') {
    // rehydrate the bundle marks
    rehydrateMarks().then(() => {
        ReactDOM.hydrate(app, element);
    });
} else {
    ReactDOM.render(app, element);
}
