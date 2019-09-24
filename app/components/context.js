import React, {useEffect, useContext} from "react";

const APIContext = React.createContext();

const APIContextProvider = APIContext.Provider;

const useAction = (cb, {clientOnly = false} = {}) => {
    if (process.browser) {
        useEffect(() => {
            cb()
        }, []);
    } else if (!clientOnly) {
        const context = useContext(APIContext);

        if (!context) {
            throw new Error("Missing context provider...")
        }

        context.push(cb);
    }
}

const execAPIContext = context => Promise.all(context.map(context => context()))

export {useAction, execAPIContext, APIContextProvider};
