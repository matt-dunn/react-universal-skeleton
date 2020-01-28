// import {APIError, APPError} from "components/api";
import {ExampleItemState} from "../../../reducers/__dummy__/example";

export interface ExampleResponse {
    id: string;
    name: string;
}

interface ExampleListResponse {
    [index: number]: ExampleResponse;
}

export interface ExampleGetList {
    (page?: number, count?: number, cancel?: any): Promise<ExampleListResponse>;
}

export interface ExampleGetItem {
    (cancel?: any): Promise<ExampleResponse>;
}

export interface ExampleEditItem {
    (item: ExampleItemState, cancel?: any): Promise<ExampleResponse>;
}

export interface ExampleApi {
    exampleGetList: ExampleGetList;
    exampleGetItem: ExampleGetItem;
    exampleEditItem: ExampleEditItem;
}

const exampleApi: ExampleApi = {
    exampleGetList:(page = 0, count = 3, cancel) => new Promise<ExampleListResponse>((resolve/*, reject*/) => {
        console.log("API CALL: exampleGetList", page, count);
        // throw new Error("Error in exampleGetList")
        // throw new APIError("Authentication Failed", "auth", 401)
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

        cancel && cancel.on(() => {
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

        cancel && cancel.on(() => {
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
        }, 15000);

        cancel && cancel.on(() => {
            console.error("@@@@@@CANCEL: exampleEditItem **************", item.id);
            clearTimeout(t);
        });
    })
};

export default exampleApi;
