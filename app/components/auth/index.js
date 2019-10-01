import React, {useContext} from "react";
import PropTypes from "prop-types";
import { useSelector } from 'react-redux'

const AuthContext = React.createContext(undefined);

const AuthProvider = ({children}) => {
    const auth = useSelector(state => state.auth)

    return (
        <AuthContext.Provider value={auth}>
            {children}
        </AuthContext.Provider>
    );
}

AuthProvider.propTypes = {
    children: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.node),
        PropTypes.node
    ])
};

export const useAuthenticatedUser = () => {
    const {authenticatedUser} = useContext(AuthContext);

    if ((authenticatedUser && authenticatedUser.$status && authenticatedUser.$status.complete && authenticatedUser)) {
        const {$status, ...rest} = authenticatedUser;
        return {...rest}
    }
}

export default AuthProvider;
