import React, {useEffect} from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, withRouter } from "react-router-dom";
import { loadableReady } from "@loadable/component";

import {deserialize} from "components/state-mutate-with-status";

import {FormDataState} from "components/actions/form";
import {AsyncData} from "components/ssr/safePromise";
import {ErrorLike} from "components/error";

import getStore from "./store";

import Bootstrap from "./Bootstrap";
import App from "./App";

type Global = {
    __PRELOADED_STATE__: any;
    __ERROR_STATE__: ErrorLike;
    __PRELOADED_FORM_STATE__: FormDataState;
    __ASYNC_DATA_STATE__: any;
    __LANGUAGE_PACK__: any;

    __PRERENDERED_SSR__: boolean;

    STORE: any;
}

const global = window as unknown as Global;

const store = getStore(deserialize(JSON.stringify(global.__PRELOADED_STATE__)));
const error = {error: global.__ERROR_STATE__};
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

import PouchDB from "pouchdb";
import PouchDBFind from "pouchdb-find";

PouchDB.plugin(PouchDBFind);


type Kitten = {
    name: string;
    occupation: string;
    age: number;
    hobbies: string[];
};

(async function() {
    const db = new PouchDB("kittens");

    const dbUrl = new URL("/db/kittens", location.origin);
    const dbRemote = new PouchDB(dbUrl.toString());

    db.sync(dbRemote, {
        live: true
    }).on("change", function (change) {
        console.error("@@CHANGE", change);
    }).on("error", function (err) {
        console.error("@@ERROR", err);
    });


    console.error(db, dbRemote);

    console.error(await db.info());

    console.error(await dbRemote.info());

    const doc = {
        "_id": "mittens",
        "name": "Mittens",
        "occupation": "kitten",
        "age": 3,
        "hobbies": [
            "playing with balls of yarn",
            "chasing laser pointers",
            "lookin' hella cute"
        ]
    };

    // try {
    //     console.error("PUT", await db.put(doc));
    // } catch (ex) {
    //     console.error("PUT ERROR", ex)
    // }

    const currentDoc = await db.get<Kitten>("mittens");
    console.error(currentDoc);

    // await db.put({
    //   ...currentDoc,
    //     age: currentDoc.age + 1
    // })

    console.error("LOCAL", await db.get("mittens", {revs: true, revs_info: true}));
    console.error("REMOTE", await dbRemote.get("mittens", {revs: true, revs_info: true}));

    await db.createIndex({
        index: {fields: ["name"]}
    });

    const d = await dbRemote.find({
        selector: {
            name: "Mittens"
        }
    });

    console.error("FOUND", d);

    console.error(await db.info());

    console.error(await dbRemote.info());
}());
