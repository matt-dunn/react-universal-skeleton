import PropTypes from "prop-types";
import React from "react";

import {FoldContext} from "./contexts";

const AboveTheFold = ({children}) => {
    return (
        <FoldContext.Provider value={{processOnServer: true}}>
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
