import {APIError, APPError} from "../index";

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

export interface IExampleApi {
    exampleGetList: IExampleGetList;
    exampleGetItem: IExampleGetItem;
}

const exampleApi: IExampleApi = {
    exampleGetList:() => new Promise<IExampleListResponse>(resolve => {
        console.log("API CALL: exampleGetList")
        // throw new Error("bugger")
        // throw new APIError("Authentication Failed", "auth", 402)
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
        // throw new Error("bugger")
        // throw new APIError("Authentication Failed", "auth", 401)
        setTimeout(() => {
            console.log("API CALL COMPLETE: exampleGetItem")
            resolve({
                id: '4',
                name: 'Item 4',
            })
        }, 3000)
    })
}

export default exampleApi;
