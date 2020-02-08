import React from "react";

import {ErrorLike} from "components/error";

export type FoldContext = {
    processOnServer: boolean;
}

export type ErrorContext = {
    error?: ErrorLike;
}

export type ErrorHandlerContext = {
    handleError: (error: ErrorLike) => boolean;
}

export const FoldContext = React.createContext<FoldContext | undefined>(undefined);

export const ErrorHandlerContext = React.createContext<ErrorHandlerContext | undefined>(undefined);

export const ErrorContext = React.createContext<ErrorContext | undefined>(undefined);
