import React, {useEffect, useContext} from "react";
import { renderToStaticMarkup } from 'react-dom/server'

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

// Similar idea to getDataFromTree from 'react-apollo'
const getDataFromTree = app => {
    const apiContext = [];

    const html = renderToStaticMarkup(
        React.createElement(
            APIContextProvider,
            {value: apiContext},
            app
        )
    );

    return Promise.all(apiContext.map(context => context()))
        .then(() => html)
}

export {useAction, getDataFromTree, AboveTheFold};
