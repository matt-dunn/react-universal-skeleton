import React from 'react'

import { useParams, useHistory } from "react-router-dom";
import {Dispatch} from "redux";
import {connect} from "react-redux";

import {IAppState} from "../reducers";
import * as actions from "../actions";
import Page from '../styles/Page'
import {AuthState} from "../reducers/auth";
import Status from "components/state-mutate-with-status/status";

import useWhatChanged from "components/whatChanged/useWhatChanged";

export type LoginProps = { auth: AuthState, onLogin: (username: string, password: string) => any };

const Login = ({auth, onLogin}: LoginProps, ...props: any[]) => {
    const {from} = useParams() || "/";
    const history = useHistory();
    const {complete, isActive, processing, hasError, error} = Status(auth.authenticatedUser && auth.authenticatedUser.$status);

    useWhatChanged(Login, { auth, onLogin, ...props });

    return (
        <Page>
            Login

            <button
                disabled={processing}
                onClick={() => {
                    onLogin("clem@demo.com", "xxx")
                        .then(() => {
                            // @ts-ignore
                            window.authenticated = true;
                            from && history.replace(decodeURIComponent(from))
                        })
                }}
            >
                LOGIN
            </button>
        </Page>
    )
}

const mapStateToProps = (state: IAppState) => {
    const auth = state.auth;

    return { auth }
};

const mapDispatchToProps = (dispatch: Dispatch<actions.RootActions>) => {

    const onLogin = (username: string, password: string): any => dispatch(actions.authActions.login({username, password}));

    return {
        onLogin
    }
};

const container = connect(
    mapStateToProps,
    mapDispatchToProps
)(Login);

export default container
