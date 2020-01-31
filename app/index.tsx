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

type Global = {
    __PRELOADED_STATE__: any;
    __ERROR_STATE__: any;
    __PRELOADED_FORM_STATE__: any;
    __ASYNC_DATA_STATE__: any;
    __LANGUAGE_PACK__: any;

    __PRERENDERED_SSR__: boolean;

    STORE: any;
}

const global = window as unknown as Global;

const store = getStore(deserialize(JSON.stringify(global.__PRELOADED_STATE__)));
const error = global.__ERROR_STATE__;
const formData = FormDataState(global.__PRELOADED_FORM_STATE__);
const asyncData = new AsyncData(global.__ASYNC_DATA_STATE__);
const languagePack = global.__LANGUAGE_PACK__;

console.error(store.getState());

const ScrollToTop = withRouter(({ children, location: { pathname } }): any => {
    useEffect(() => {
        window.scrollTo(0, 0);
        }, [pathname]);

    return children;
});

global.STORE = store;

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

if (global.__PRERENDERED_SSR__) {
    loadableReady(() => {
        ReactDOM.hydrate(app, element, () => {
            global.__PRERENDERED_SSR__ = false;
        });
    });
} else {
    ReactDOM.render(app, element, () => {
        global.__PRERENDERED_SSR__ = false;
    });
}

if (process.env.PWA === "true") {
    require("./worker").default();
}
