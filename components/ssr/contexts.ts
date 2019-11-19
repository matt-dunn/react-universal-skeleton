import React from "react";

type AsyncDataContentData = {
    [key: string]: any;
}

export type AsyncDataContext = {
    data: AsyncDataContentData;
};

export const AsyncContext = React.createContext<Promise<any>[] | undefined>(undefined);

export const AsyncDataContext = React.createContext<AsyncDataContext | undefined>(undefined);
