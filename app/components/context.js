import React, {useEffect, useContext} from "react";
import PropTypes from "prop-types";

import { renderToStaticMarkup } from 'react-dom/server'

const APIContext = React.createContext(undefined);

const APIContextProvider = APIContext.Provider;

const FoldContext = React.createContext(undefined);

const FoldProvider = FoldContext.Provider;

const useAction = (test, action, deps = []) => {
    if (process.browser) {
        useEffect(() => {
            test() && action()
        }, deps);
    } else {
        const {enabled = false} = useContext(FoldContext) || {};

        if (enabled) {
            const context = useContext(APIContext);

            context && context.push(action);
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

AboveTheFold.propTypes = {
    children: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.node),
        PropTypes.node
    ])
};

const ClientOnly = ({children}) => {
    return (
        <FoldProvider value={{enabled: false}}>
            {children}
        </FoldProvider>
    )
}

ClientOnly.propTypes = {
    children: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.node),
        PropTypes.node
    ])
};

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
