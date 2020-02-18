import {WrapWithAbortSignal} from "components/api";

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

export type ExampleApi = {
    exampleGetList: ExampleGetList;
    exampleGetItem: ExampleGetItem;
    exampleEditItem: ExampleEditItem;
}

// let retryCount = 10;
export const ExampleApi: ExampleApi = {
    exampleGetList: (page = 0, count = 3) => signal => new Promise<ExampleList>((resolve, reject) => {
        console.log("API CALL: exampleGetList", page, count);

        // if (retryCount < 4) {
        //     retryCount++;
        //     throw new Error("Error in exampleGetList");
        // } else {
        //     retryCount = 0;
        // }

        if (page === 4) {
            if (!isAuthenticated()) {
                throw new APIError("Auth Error...", 123, 401);
            }
            // throw new APPError("Error in exampleGetList", 123);
        }

        // throw new APIError("Auth Error...", 123, 401)
        // throw new APPError("APP Error...", 123);

        const t = setTimeout(() => {
            console.log("API CALL COMPLETE: exampleGetList");
            // reject(new Error("Error in exampleGetList"))

            resolve(Array.from(Array(count).keys()).map(index => {
                const i = index + (page * count);
                return {
                    id: `item-${i + 1}`,
                    name: `Item ${i + 1}`
                };
            }));
        }, (process as any).browser ? 2000 : 0);

        signal && (signal.onabort = () => {
            console.error("@@@@@@CANCEL: exampleGetList **************");
            clearTimeout(t);
            reject(new Error("Cancelled"));
        });
    }),
    exampleGetItem:() => signal => new Promise<ExampleItem>((resolve, reject) => {
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
    exampleEditItem:(item) => signal => new Promise<ExampleItem>((resolve, reject) => {
        console.log("API CALL: exampleEditItem", item.id);

        if (item.name.toLocaleLowerCase() === "item") {
            throw new Error("Error in exampleEditItem");
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
