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

import {deserialize} from "components/state-mutate-with-status/utils";

const store = getStore(deserialize(JSON.stringify(window.__PRELOADED_STATE__)));

console.error(store.getState())

const ScrollToTop = withRouter(({ children, location: { pathname } }) => {
    useEffect(() => {
        window.scrollTo(0, 0);
        }, [pathname]);

    return children;
});

window.STORE = store;

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

const element = document.getElementById('app');

if (process.env.NODE_ENV === 'production') {
    // rehydrate the bundle marks
    rehydrateMarks().then(() => {
        ReactDOM.hydrate(app, element);
    });
} else {
    ReactDOM.render(app, element);
}
