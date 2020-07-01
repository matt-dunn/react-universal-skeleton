import axios from "axios";

import {APIContext, WrapWithAbortSignal} from "components/api";

import {APIError} from "components/api";

import {isAuthenticated} from "../auth";

export type ExampleItem = {
    id: string;
    name: string;
}

export type ExampleList = ExampleItem[];

type ExampleGetList = WrapWithAbortSignal<{
    (page?: number, count?: number): Promise<ExampleList>;
}>

type ExampleGetItem = WrapWithAbortSignal<{
    (): Promise<ExampleItem>;
}>

type ExampleEditItem = WrapWithAbortSignal<{
    (item: ExampleItem): Promise<ExampleItem>;
}>

type ExampleApiOptions = {
    endpoint: string;
}

export type ExampleApi = {
    (options: ExampleApiOptions, context?: APIContext): {
        exampleGetList: ExampleGetList;
        exampleGetItem: ExampleGetItem;
        exampleEditItem: ExampleEditItem;
    };
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

// let retryCount = 10;
export const ExampleApi: ExampleApi = (options, context) => {
    const db = !context && new PouchDB("kittens");

    const dbUrl = new URL("/db/kittens", "https://127.0.0.1:12345"); //location.origin);
    const dbRemote = new PouchDB(dbUrl.toString(), {
        fetch: function (url, opts) {
            if (opts?.headers && context?.req.headers.cookie) {
                (opts.headers as any).set("Cookie", context?.req.headers.cookie);
            }
            return PouchDB.fetch(url, opts);
        }
    });

    if (db) {
        db.sync(dbRemote, {
            live: true,
            retry: true
        }).on("change", function (change) {
            console.error("@@CHANGE", change);
        }).on("error", function (err) {
            console.error("@@ERROR", err);
        });
    }

    console.error("@@@@OPTIONS", options, context?.req.headers.cookie);

    (async function() {
        console.error("LOCAL", db && await db.get("mittens", {revs: false, revs_info: false}));
        console.error("REMOTE", await dbRemote.get("mittens", {revs: false, revs_info: false}));
    }());

    const activeDB = db || dbRemote;

    return {
        exampleGetList: (page = 0, count = 3) => async signal => {
            try {
                const url = new URL("/api/list", "https://127.0.0.1:12345");
                url.searchParams.set("page", page.toString());
                url.searchParams.set("count", count.toString());

                const response = await axios.get<ExampleList>(url.toString(), {withCredentials: true});

                const document = await activeDB.get<Kitten>("mittens", {revs: false, revs_info: false});

                // console.error("DOCUMENT", document);

                return response.data.map(item => {
                    if (item.id === "item-1") {
                        return {
                            ...item,
                            name: document.name
                        };
                    }

                    return item;
                });
            } catch (e) {
                if (e.response?.status === 401) {
                    throw new APIError("Unauthorised", 123, 401);
                }

                throw e;
            }
        },
        // exampleGetList: (page = 0, count = 3) => signal => new Promise<ExampleList>((resolve, reject) => {
        //     console.log("API CALL: exampleGetList", page, count);
        //
        //     // if (retryCount < 4) {
        //     //     retryCount++;
        //     //     throw new Error("Error in exampleGetList");
        //     // } else {
        //     //     retryCount = 0;
        //     // }
        //
        //     if (page === 4) {
        //         if (!isAuthenticated()) {
        //             throw new APIError("Auth Error...", 123, 401);
        //         }
        //         // throw new APPError("Error in exampleGetList", 123);
        //     }
        //
        //     // throw new APIError("Auth Error...", 123, 401)
        //     // throw new APPError("APP Error...", 123);
        //
        //     const t = setTimeout(() => {
        //         console.log("API CALL COMPLETE: exampleGetList");
        //         // reject(new Error("Error in exampleGetList"))
        //
        //         resolve(Array.from(Array(count).keys()).map(index => {
        //             const i = index + (page * count);
        //             return {
        //                 id: `item-${i + 1}`,
        //                 name: `Item ${i + 1}`
        //             };
        //         }));
        //     }, (process as any).browser ? 2000 : 0);
        //
        //     signal && (signal.onabort = () => {
        //         console.error("@@@@@@CANCEL: exampleGetList **************");
        //         clearTimeout(t);
        //         reject(new Error("Cancelled"));
        //     });
        // }),
        exampleGetItem: () => signal => new Promise<ExampleItem>((resolve, reject) => {
            console.log("API CALL: exampleGetItem");
            // throw new Error("Error in exampleGetItem")
            // if (typeof window === 'undefined' || !(window as any).authenticated) {
            //     throw new APIError("Authentication Failed", "auth", 401)
            // }
            const t = setTimeout(() => {
                // reject(new Error("Error in exampleGetItem"))
                console.log("API CALL COMPLETE: exampleGetItem");
                resolve({
                    id: "4",
                    name: "Item 4",
                });
            }, (process as any).browser ? 3000 : 0);

            signal && (signal.onabort = () => {
                console.error("@@@@@@CANCEL: exampleGetItem **************");
                clearTimeout(t);
                reject(new Error("Cancelled"));
            });
        }),
        exampleEditItem: (item) => signal => new Promise<ExampleItem>((resolve, reject) => {
            console.log("API CALL: exampleEditItem", item.id);

            if (item.name.toLocaleLowerCase() === "item") {
                throw new Error("Error in exampleEditItem");
            }

            if (db && item.id === "item-1") {
                db.get<Kitten>("mittens").then(doc => {
                    db.put({
                        ...doc,
                        name: item.name
                    }).then(() => {
                        resolve(item);
                    });
                });

                return;
            }

            const t = setTimeout(() => {
                if (item.name.toLocaleLowerCase() === "items") {
                    reject(new Error("Error in exampleEditItem"));
                }
                console.log("API CALL COMPLETE: exampleEditItem", item.id);
                // reject(new Error("Error in exampleEditItem"))
                // reject(new APIError("Authentication Failed", "auth", 403))
                resolve(item);
            }, 5000);

            signal && (signal.onabort = () => {
                console.error("@@@@@@CANCEL: exampleEditItem **************", item.id);
                clearTimeout(t);
                reject(new Error("Cancelled"));
            });
        })
    };
};
