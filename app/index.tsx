import React, {useEffect} from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, withRouter } from "react-router-dom";
import { loadableReady } from "@loadable/component";

import {deserialize} from "components/state-mutate-with-status";

import {FormDataState} from "components/actions/form";
import {AsyncData} from "components/ssr/safePromise";

import getStore from "./store";

import Bootstrap from "./Bootstrap";
import App from "./App";

const store = getStore(deserialize(JSON.stringify(window.__PRELOADED_STATE__)));
const error = window.__ERROR_STATE__;
const formData = FormDataState(window.__PRELOADED_FORM_STATE__);
const asyncData = new AsyncData(window.__ASYNC_DATA_STATE__);
const languagePack = window.__LANGUAGE_PACK__;

console.error(store.getState());

const ScrollToTop = withRouter(({ children, location: { pathname } }) => {
    useEffect(() => {
        window.scrollTo(0, 0);
        }, [pathname]);

    return children;
});

window.STORE = store;

const app = (
    <Bootstrap
        languagePack={languagePack}
        asyncData={asyncData}
        formData={formData}
        error={error}
        store={store}
    >
        <BrowserRouter>
            <ScrollToTop>
                <App />
            </ScrollToTop>
        </BrowserRouter>
    </Bootstrap>
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

if (process.env.PWA === "true") {
    require("./worker").default();
}
