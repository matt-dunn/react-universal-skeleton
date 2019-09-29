import React, {useEffect, useContext} from "react";
import PropTypes from "prop-types";
import isPromise from 'is-promise';

import { renderToStaticMarkup } from 'react-dom/server'

const APIContext = React.createContext(undefined);

const APIContextProvider = APIContext.Provider;

const FoldContext = React.createContext(undefined);

const FoldProvider = FoldContext.Provider;

const ErrorContext = React.createContext(undefined);

const ErrorProvider = ErrorContext.Provider;

const useAction = (action, test) => {
    const {handleError} = useContext(ErrorContext) || {};
    const {processOnServer = false} = useContext(FoldContext) || {};

    if (process.browser) {
        useEffect(() => {
            if ((!processOnServer || !window.__PRERENDERED_SSR__) && (!test || test())) {
                const payload = action()

                if (isPromise(payload)) {
                    payload
                        .catch(ex => {
                            if (handleError && handleError(ex) === true) {   // Handled errors should not throw on client
                                console.error(ex);
                                return;
                            }

                            throw ex;
                        })
                }
            }
        }, []);
    } else if (processOnServer) {
        const context = useContext(APIContext);

        if (context) {
            const payload = action();

            if (isPromise(payload)) {
                context.push(
                    payload
                        .catch(ex => {
                            if (handleError && handleError(ex) === true) {   // Handled errors should throw on the server so getDataFromTree will immediately bail
                                throw ex;
                            }

                            console.error(ex);
                        })
                );
            }
        }
    }

}

const AboveTheFold = ({children}) => {
    return (
        <FoldProvider value={{processOnServer: true}}>
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
        <FoldProvider value={{processOnServer: false}}>
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

        // TODO: move somewhere better...!
        this.unlisten = history.listen(({ pathname }) => {
            window.__PRERENDERED_SSR__ = false;
            this.unlisten();
        })
    }

    componentWillUnmount() {
        this.unlisten()
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
