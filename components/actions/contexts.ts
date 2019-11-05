import React from "react";

export const APIContext = React.createContext<Promise<any>[] | undefined>(undefined);

export const FoldContext = React.createContext(undefined);

export const ErrorHandlerContext = React.createContext(undefined);

export const ErrorContext = React.createContext(undefined);
