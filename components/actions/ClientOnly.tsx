import React, {ReactNode} from "react";

import {FoldContext} from "./contexts";

const value = {processOnServer: false};

type ClientOnlyProps = {
    children: ReactNode;
}

const ClientOnly = ({children}: ClientOnlyProps) => {
    return (
        <FoldContext.Provider value={value}>
            {children}
        </FoldContext.Provider>
    );
};

export default ClientOnly;
