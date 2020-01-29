import React from "react";
import { useParams, useHistory } from "react-router-dom";
import {Dispatch} from "redux";
import {connect} from "react-redux";

import {getStatus} from "components/state-mutate-with-status/status";

import {AppState} from "../reducers";
import * as actions from "../actions";
import Page from "../styles/Page";
import {AuthState} from "../reducers/auth";

import useWhatChanged from "components/whatChanged/useWhatChanged";

export type LoginProps = { auth: AuthState; onLogin: (username: string, password: string) => any };

const Login = ({auth, onLogin}: LoginProps, ...props: any[]) => {
    const {from} = useParams() || "/";
    const history = useHistory();
    const {processing} = getStatus(auth.authenticatedUser);

    useWhatChanged(Login, { auth, onLogin, ...props });

    return (
        <Page>
            Login

            <button
                disabled={processing}
                onClick={() => {
                    onLogin("clem@demo.com", "xxx")
                        .then(() => {
                            history.replace((from && decodeURIComponent(from)) || "/");
                        });
                }}
            >
                LOGIN
            </button>
        </Page>
    );
};

const mapStateToProps = ({auth}: AppState) => ({auth});

const mapDispatchToProps = (dispatch: Dispatch<actions.RootActions>) => ({
    onLogin: (username: string, password: string): any => dispatch(actions.authActions.login({username, password}))
});

const container = connect(
    mapStateToProps,
    mapDispatchToProps
)(Login);

export default container;
