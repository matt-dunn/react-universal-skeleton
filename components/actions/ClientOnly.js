import PropTypes from "prop-types";
import React from "react";

import {FoldContext} from "./contexts";

const value = {processOnServer: false};

const ClientOnly = ({children}) => {
    return (
        <FoldContext.Provider value={value}>
            {children}
        </FoldContext.Provider>
    )
}

ClientOnly.propTypes = {
    children: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.node),
        PropTypes.node
    ])
};

export default ClientOnly;
