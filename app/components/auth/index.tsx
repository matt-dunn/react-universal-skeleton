import React, {ReactNode, useContext} from "react";
import { useSelector } from "react-redux";

import {AuthState} from "../../reducers/auth";
import {AppState} from "../../reducers";

import {getStatus} from "components/state-mutate-with-status";

const AuthContext = React.createContext<AuthState | undefined>(undefined);

type AboutProviderProps = {
    children: ReactNode;
}

const AuthProvider = ({children}: AboutProviderProps) => {
    const auth = useSelector<AppState, AuthState>(state => state && state.auth);

    return (
        <AuthContext.Provider value={auth}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuthenticatedUser = () => {
    const {authenticatedUser} = useContext(AuthContext) || {};
    const {complete} = getStatus(authenticatedUser);

    return complete && authenticatedUser;
};

export default AuthProvider;
