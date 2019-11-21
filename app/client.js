import React, {useEffect} from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { HelmetProvider } from "react-helmet-async";
import { BrowserRouter, withRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { loadableReady } from "@loadable/component";

import ErrorProvider from "components/actions/ErrorProvider";
import {deserialize} from "components/state-mutate-with-status/utils";

import getStore from "./store";
import {FormDataState, FormDataProvider} from "components/actions/form";
import {AsyncData, AsyncDataContextProvider} from "../components/ssr/safePromise";

const store = getStore(deserialize(JSON.stringify(window.__PRELOADED_STATE__)));
const error = window.__ERROR_STATE__;
const formData = FormDataState(window.__PRELOADED_FORM_STATE__);
const asyncData = new AsyncData(window.__ASYNC_DATA_STATE__);

console.error(store.getState());

const ScrollToTop = withRouter(({ children, location: { pathname } }) => {
    useEffect(() => {
        window.scrollTo(0, 0);
        }, [pathname]);

    return children;
});

window.STORE = store;

const app = (
    <AsyncDataContextProvider value={asyncData}>
        <FormDataProvider value={formData}>
            <ErrorProvider value={{error}}>
                <HelmetProvider>
                    <Provider store={store}>
                        <BrowserRouter>
                            <ScrollToTop>
                                <App />
                            </ScrollToTop>
                        </BrowserRouter>
                    </Provider>
                </HelmetProvider>
            </ErrorProvider>
        </FormDataProvider>
    </AsyncDataContextProvider>
);

const element = document.getElementById("app");

if (window.__PRERENDERED_SSR__) {
    loadableReady(() => {
        ReactDOM.hydrate(app, element, () => {
            window.__PRERENDERED_SSR__ = false;
        });
    });
} else {
    ReactDOM.render(app, element, () => {
        window.__PRERENDERED_SSR__ = false;
    });
}
