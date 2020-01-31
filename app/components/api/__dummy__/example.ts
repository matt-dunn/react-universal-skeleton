import {Cancel} from "components/redux/middleware/sagaAsyncAction";

import {ExampleItemState} from "../../../reducers/__dummy__/example";
// import {APIError, APPError} from "components/api";

export interface ExampleResponse {
    id: string;
    name: string;
}

interface ExampleListResponse {
    [index: number]: ExampleResponse;
}

export interface ExampleGetList {
    (page?: number, count?: number, cancel?: Cancel): Promise<ExampleListResponse>;
}

export interface ExampleGetItem {
    (cancel?: Cancel): Promise<ExampleResponse>;
}

export interface ExampleEditItem {
    (item: ExampleItemState, cancel?: Cancel): Promise<ExampleResponse>;
}

export interface ExampleApi {
    exampleGetList: ExampleGetList;
    exampleGetItem: ExampleGetItem;
    exampleEditItem: ExampleEditItem;
}

// let retryCount = 10;
export const exampleApi: ExampleApi = {
    exampleGetList:(page = 0, count = 3, cancel) => new Promise<ExampleListResponse>((resolve/*, reject*/) => {
        console.log("API CALL: exampleGetList", page, count);
        // if (retryCount < 4) {
        //     retryCount++;
        //     throw new Error("Error in exampleGetList");
        // } else {
        //     retryCount = 0;
        // }
        if (page === 4) {
            throw new Error("Error in exampleGetList");
        }
        // throw new APIError("Auth Error...", 123, 500)
        // throw new APPError("APP Error...", 123);
        const t = setTimeout(() => {
            console.log("API CALL COMPLETE: exampleGetList");
            // reject(new Error("Error in exampleGetList"))

            resolve(Array.from(Array(count).keys()).map(index => {
                const i = index + (page * count);
                return {
                    id: `item-${i}`,
                    name: `Item ${i + 1}`
                };
            }));
        }, (process as any).browser ? 2000 : 0);

        cancel && cancel(() => {
            console.error("@@@@@@CANCEL: exampleGetList **************");
            clearTimeout(t);
        });
    }),
    exampleGetItem:(cancel) => new Promise<ExampleResponse>((resolve/*, reject*/) => {
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
        }, 3000);

        cancel && cancel(() => {
            console.error("@@@@@@CANCEL: exampleGetItem **************");
            clearTimeout(t);
        });
    }),
    exampleEditItem:(item, cancel) => new Promise<ExampleResponse>((resolve/*, reject*/) => {
        console.log("API CALL: exampleEditItem", item.id);
        // throw new Error("Error in exampleEditItem")

        const t = setTimeout(() => {
            console.log("API CALL COMPLETE: exampleEditItem", item.id);
            // reject(new Error("Error in exampleEditItem"))
            // reject(new APIError("Authentication Failed", "auth", 403))
            resolve(item);
        }, 5000);

        cancel && cancel(() => {
            console.error("@@@@@@CANCEL: exampleEditItem **************", item.id);
            clearTimeout(t);
        });
    })
};
