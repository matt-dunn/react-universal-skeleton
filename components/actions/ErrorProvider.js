import React from "react";
import PropTypes from "prop-types";

import {ErrorContext} from "./contexts";

class ErrorProvider extends React.PureComponent {
    render() {
        const {value, children} = this.props;

        return (
            <ErrorContext.Provider value={value}>
                {children}
            </ErrorContext.Provider>
        )
    }
}

ErrorProvider.propTypes = {
    children: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.node),
        PropTypes.node
    ]),

    value: PropTypes.object.isRequired,
};

export default ErrorProvider;
