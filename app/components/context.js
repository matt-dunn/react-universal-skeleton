import React, {useEffect, useContext} from "react";
import PropTypes from "prop-types";

import { renderToStaticMarkup } from 'react-dom/server'

const APIContext = React.createContext(undefined);

const APIContextProvider = APIContext.Provider;

const FoldContext = React.createContext(undefined);

const FoldProvider = FoldContext.Provider;

const ErrorContext = React.createContext(undefined);

const ErrorProvider = ErrorContext.Provider;

const useAction = (test, action, deps = []) => {
    const {handleError} = useContext(ErrorContext) || {};

    if (process.browser) {
        useEffect(() => {
            if (test()) {
                action()
                    .catch(ex => {
                        if(handleError && handleError(ex) === true) {   // Handled errors should not throw on client
                            console.error(ex);
                            return;
                        }

                        throw ex;
                    })
            }
        }, deps);
    } else {
        const {enabled = false} = useContext(FoldContext) || {};

        if (enabled) {
            const context = useContext(APIContext);

            context && context.push(
                action()
                    .catch(ex => {
                        if(handleError && handleError(ex) === true) {   // Handled errors should throw on the server so getDataFromTree will immediately bail
                            throw ex;
                        }

                        console.error(ex);
                    })
            );
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

    return Promise.all(apiContext)
        .then(() => html)
        .catch(ex => console.error(ex)) // Swallow exceptions - they should be handled by the app...
}

import { withRouter } from "react-router-dom";

@withRouter
class ErrorHandler extends React.PureComponent {
    constructor(props) {
        super(props);

        const {handler, location: {pathname, search, hash}, history} = this.props;

        this.handler = {
            handleError: ex => handler(
                ex,
                `${pathname}${(search && `?${encodeURIComponent(search.substr(1))}`) || ""}${(hash && `#${encodeURIComponent(hash.substr(1))}`) || ""}`,
                history
            )
        }
    }

    render() {
        const {children} = this.props;

        return (
            <ErrorProvider value={this.handler}>
                {children}
            </ErrorProvider>
        )
    }
}

ErrorHandler.propTypes = {
    children: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.node),
        PropTypes.node
    ]),

    handler: PropTypes.func.isRequired,

    location: PropTypes.object,

    match: PropTypes.object
};

export {useAction, getDataFromTree, AboveTheFold, ClientOnly, ErrorHandler};
