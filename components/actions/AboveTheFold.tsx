import React, {ReactNode} from "react";

import {FoldContext} from "./contexts";

const value = {processOnServer: true};

type AboveTheFoldProps = {
    children: ReactNode;
}

const AboveTheFold = ({children}: AboveTheFoldProps) => {
    return (
        <FoldContext.Provider value={value}>
            {children}
        </FoldContext.Provider>
    );
};

export default AboveTheFold;
