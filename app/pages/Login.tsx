import React from 'react'

import Page from '../components/Page.jsx'
import { useParams, useHistory } from "react-router-dom";
import {IAppState} from "../reducers";
import {Dispatch} from "redux";
import * as actions from "../actions";
import {connect} from "react-redux";

import {AuthState} from "../reducers/auth";
import Status from "../components/state-mutate-with-status/status";

export type LoginProps = { auth: AuthState, onLogin: (username: string, password: string) => any };

const Login = ({auth, onLogin}: LoginProps) => {
    console.log(auth)
    const {from} = useParams() || "/";
    const history = useHistory();
    const {complete, isActive, processing, hasError, error} = Status(auth.authenticatedUser && auth.authenticatedUser.$status);

    return (
        <Page>
            Login

            <button
                disabled={processing}
                onClick={() => {
                    onLogin("bob", "xxx")
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
