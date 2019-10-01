import PropTypes from "prop-types";
import React from "react";

import {FoldContext} from "./contexts";

const ClientOnly = ({children}) => {
    return (
        <FoldContext.Provider value={{processOnServer: false}}>
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
