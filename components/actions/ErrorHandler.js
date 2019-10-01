import React from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";

import {ErrorContext} from "./contexts";

@withRouter
class ErrorHandler extends React.PureComponent {
    constructor(props) {
        super(props);

        this.handler = {
            handleError: ex => {
                const {handler, location: {pathname, search, hash}, history} = this.props;

                return handler(
                    ex,
                    `${pathname}${(search && `?${encodeURIComponent(search.substr(1))}`) || ""}${(hash && `#${encodeURIComponent(hash.substr(1))}`) || ""}`,
                    history
                )
            }
        }

        // TODO: move somewhere better...!
        const {history} = this.props;
        this.unlisten = history.listen(() => {
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
            <ErrorContext.Provider value={this.handler}>
                {children}
            </ErrorContext.Provider>
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

export default ErrorHandler;
