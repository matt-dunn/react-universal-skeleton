import React, {ReactNode} from "react";

import {ErrorContext} from "./contexts";

type ErrorProviderProps = {
    value: ErrorContext;
    children: ReactNode;
}

const ErrorProvider = ({value, children}: ErrorProviderProps) => {
    return (
        <ErrorContext.Provider value={value}>
            {children}
        </ErrorContext.Provider>
    );
};

export default ErrorProvider;
