export interface IExampleResponse {
    id: string;
    name: string;
}

export interface IExample {
    (id: string, name: string): Promise<IExampleResponse>;
}

export interface IExampleList {
    (id: string, name: string): Promise<IExampleResponse>;
}

export interface IExampleApi {
    example: IExample;
    exampleList: IExampleList;
}

const exampleApi: IExampleApi = {
    example: (id, name) => new Promise<IExampleResponse>(resolve => setTimeout(() => resolve({id, name}), 6000)),
    // example: () => new Promise<any>((resolve, reject) => setTimeout(() => reject(new Error('Example API error')), 2000)),
    exampleList: (id, name) => new Promise<IExampleResponse>(resolve => setTimeout(() => resolve({id, name}), 6000))
}

export default exampleApi;
