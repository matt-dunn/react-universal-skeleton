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
    if (process.browser) {
        const {handleError} = useContext(ErrorContext) || {};

        useEffect(() => {
            if (test()) {
                action()
                    .catch(ex => {
                        if (handleError) {
                            handleError(ex)
                        } else {
                            throw ex;
                        }
                    })
            }
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

import { withRouter } from "react-router";

@withRouter
class ErrorHandler extends React.PureComponent {
    constructor(props) {
        super(props);

        this.handler = {
            handleError: ex => {
                console.log("HANDLE ERROR!****", ex.message, ex.status, this)
                if (ex.status === 401) {
                    this.props.history.push("/login")
                }
            }
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

export {useAction, getDataFromTree, AboveTheFold, ClientOnly, ErrorHandler};
