export interface IExampleResponse {
    id: string;
    name: string;
}

// export interface IExampleListResponse: Array<IExampleResponse>

interface IExampleListResponse {
    [index: number]: IExampleResponse;
}

// export interface IExample {
//     (id: string, name: string): Promise<IExampleResponse>;
// }

export interface IExampleGetList {
    (): Promise<IExampleListResponse>;
}

export interface IExampleApi {
    exampleGetList: IExampleGetList;
    // example: IExample;
    // exampleList: IExampleList;
}

const exampleApi: IExampleApi = {
    exampleGetList:() => new Promise<IExampleListResponse>(resolve => setTimeout(() => {
        console.error("API CALLED!!!!")
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
    }, 2000))
    // example: (id, name) => new Promise<IExampleResponse>(resolve => setTimeout(() => resolve({id, name}), 6000)),
    // example: () => new Promise<any>((resolve, reject) => setTimeout(() => reject(new Error('Example API error')), 2000)),
    // exampleList: (id, name) => new Promise<IExampleResponse>(resolve => setTimeout(() => resolve({id, name}), 6000))
}

export default exampleApi;
