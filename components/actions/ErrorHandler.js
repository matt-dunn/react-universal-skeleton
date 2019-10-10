import React from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";

import {ErrorContext} from "./contexts";

@withRouter
class ErrorHandler extends React.PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            component: undefined
        };

        this.handler = {
            handleError: ex => {
                const {handler, location: {pathname, search, hash}, history} = this.props;

                const ret = handler(
                    ex,
                    `${pathname}${(search && `?${encodeURIComponent(search.substr(1))}`) || ""}${(hash && `#${encodeURIComponent(hash.substr(1))}`) || ""}`,
                    history,
                    props
                );

                if (ret !== false && ret !== true && ret) {
                    this.setState({component: ret})

                    return true;
                }

                return ret;
            }
        }

        // TODO: move somewhere better...!
        const {history} = this.props;
        this.unlisten = history.listen(() => {
            window.__PRERENDERED_SSR__ = false;
            // this.unlisten();
            this.setState({component: undefined})
        })
    }

    componentWillUnmount() {
        this.unlisten()
    }

    render() {
        const {component} = this.state;

        if (component) {
            return component;
        }

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

    history: PropTypes.object,

    location: PropTypes.object,

    match: PropTypes.object
};

export default ErrorHandler;
