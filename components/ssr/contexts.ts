import React from "react";

export const AsyncContext = React.createContext<Promise<any>[] | undefined>(undefined);

export type AsyncDataContext = {
    data: any[];
    counter: number;
};

export const AsyncDataContext = React.createContext<AsyncDataContext | undefined>(undefined);
