import React, {useEffect, useContext} from "react";

const APIContext = React.createContext();

const APIContextProvider = APIContext.Provider;

const FoldContext = React.createContext();

const FoldProvider = FoldContext.Provider;

const useAction = cb => {
    if (process.browser) {
        useEffect(() => {
            cb()
        }, []);
    } else {
        const {enabled = false} = useContext(FoldContext) || {};

        if (enabled) {
            const context = useContext(APIContext);

            if (!context) {
                throw new Error("Missing API context provider")
            }

            context.push(cb);
        }
    }
}

const AboveTheFold = ({children}) => {
    return (
        <FoldProvider value={{enabled: true}}>
            {children}
        </FoldProvider>
    )
}

const execAPIContext = context => Promise.all(context.map(context => context()))

export {useAction, execAPIContext, APIContextProvider, AboveTheFold};
