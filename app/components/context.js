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

            context && context.push(cb);
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

const ClientOnly = ({children}) => {
    return (
        <FoldProvider value={{enabled: false}}>
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
        .catch(ex => console.error(ex))
}

export {useAction, getDataFromTree, AboveTheFold, ClientOnly};
