import PropTypes from "prop-types";
import React from "react";

import {FoldContext} from "./contexts";

const value = {processOnServer: true};

const AboveTheFold = ({children}) => {
    return (
        <FoldContext.Provider value={value}>
            {children}
        </FoldContext.Provider>
    )
}

AboveTheFold.propTypes = {
    children: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.node),
        PropTypes.node
    ])
};

export default AboveTheFold;
