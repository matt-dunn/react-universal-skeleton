import React, {useEffect} from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import { HelmetProvider } from 'react-helmet-async';
import { BrowserRouter, withRouter } from 'react-router-dom'
import { rehydrateMarks } from 'react-imported-component';
import { ToastContainer } from 'react-toastify';
import { Provider } from 'react-redux';

import ErrorProvider from "components/actions/ErrorProvider";
import {deserialize} from "components/state-mutate-with-status/utils";

import './.imported';

import getStore from "./store";

const store = getStore(deserialize(JSON.stringify(window.__PRELOADED_STATE__)));
const error = window.__ERROR_STATE__;

console.error(store.getState())

const ScrollToTop = withRouter(({ children, location: { pathname } }) => {
    useEffect(() => {
        window.scrollTo(0, 0);
        }, [pathname]);

    return children;
});

window.STORE = store;

const app = (
    <ErrorProvider value={{error}}>
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
    </ErrorProvider>
);

const element = document.getElementById('app');

if (process.env.NODE_ENV === 'production') {
    // rehydrate the bundle marks
    rehydrateMarks().then(() => {
        ReactDOM.hydrate(app, element, () => {
            window.__PRERENDERED_SSR__ = false;
        });
    });
} else {
    ReactDOM.render(app, element, () => {
        window.__PRERENDERED_SSR__ = false;
    });
}
