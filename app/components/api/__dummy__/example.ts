import {APIError, APPError} from "components/api";
import {IExampleItemState} from "../../../reducers/__dummy__/example";

export interface IExampleResponse {
    id: string;
    name: string;
}

interface IExampleListResponse {
    [index: number]: IExampleResponse;
}

export interface IExampleGetList {
    (): Promise<IExampleListResponse>;
}

export interface IExampleGetItem {
    (): Promise<IExampleResponse>;
}

export interface ExampleEditItem {
    (item: IExampleItemState): Promise<IExampleResponse>;
}

export interface IExampleApi {
    exampleGetList: IExampleGetList;
    exampleGetItem: IExampleGetItem;
    exampleEditItem: ExampleEditItem;
}

const exampleApi: IExampleApi = {
    exampleGetList:() => new Promise<IExampleListResponse>(resolve => {
        console.log("API CALL: exampleGetList")
        // throw new Error("Error in exampleGetList")
        // throw new APIError("Authentication Failed", "auth", 401)
        setTimeout(() => {
            console.log("API CALL COMPLETE: exampleGetList")
            resolve([
                {
                    id: '1',
                    name: 'Item 1',
                },
                {
                    id: '2',
                    name: 'Item 2',
                },
                {
                    id: '3',
                    name: 'Item 3',
                },
            ])
        }, 1500)
    }),
    exampleGetItem:() => new Promise<IExampleResponse>(resolve => {
        console.log("API CALL: exampleGetItem")
        // throw new Error("Error in exampleGetItem")
        // if (typeof window === 'undefined' || !(window as any).authenticated) {
        //     throw new APIError("Authentication Failed", "auth", 401)
        // }
        setTimeout(() => {
            console.log("API CALL COMPLETE: exampleGetItem")
            resolve({
                id: '4',
                name: 'Item 4',
            })
        }, 3000)
    }),
    exampleEditItem:(item: IExampleItemState) => new Promise<IExampleResponse>((resolve, reject) => {
        console.log("API CALL: exampleEditItem", item.name)
        // throw new Error("Error in exampleEditItem")

        setTimeout(() => {
            console.log("API CALL COMPLETE: exampleEditItem")
            // reject(new Error("Error in exampleEditItem"))
            resolve(item)
        }, 1500)
    })
}

export default exampleApi;
