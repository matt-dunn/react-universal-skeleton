import React, {ReactNode, useContext} from "react";
import { useSelector } from "react-redux";

import {AuthState} from "../../reducers/auth";
import {AppState} from "../../reducers";

const AuthContext = React.createContext<AuthState | undefined>(undefined);

type AboutProviderProps = {
    children: ReactNode;
}

const AuthProvider = ({children}: AboutProviderProps) => {
    const auth = useSelector<AppState, any>(state => state && state.auth);

    return (
        <AuthContext.Provider value={auth}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuthenticatedUser = () => {
    const {authenticatedUser} = useContext(AuthContext) || {};

    if ((authenticatedUser && authenticatedUser.$status && authenticatedUser.$status.complete && authenticatedUser)) {
        const {$status, ...rest} = authenticatedUser; // eslint-disable-line @typescript-eslint/no-unused-vars
        return {...rest};
    }
};

export default AuthProvider;
