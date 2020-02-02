import React from "react";
import { useParams, useHistory } from "react-router-dom";
import {Dispatch} from "redux";
import {connect} from "react-redux";

import {getStatus} from "components/state-mutate-with-status";

import {AppState} from "../reducers";
import * as actions from "../actions";
import Page from "../styles/Page";
import {AuthState} from "../reducers/auth";
import {Login} from "../components/api";

import useWhatChanged from "components/whatChanged/useWhatChanged";

export type LoginProps = { auth: AuthState; login: (username: string, password: string) => any };

const LoginContainer = ({auth, login}: LoginProps, ...props: any[]) => {
    const {from} = useParams() || "/";
    const history = useHistory();
    const {processing} = getStatus(auth.authenticatedUser);

    useWhatChanged(LoginContainer, { auth, login, ...props });

    return (
        <Page>
            Login

            <button
                disabled={processing}
                onClick={() => {
                    login("clem@demo.com", "xxx")
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
    login: (username, password): any => dispatch(actions.authActions.login({username, password}))
} as {login: Login});

const container = connect(
    mapStateToProps,
    mapDispatchToProps
)(LoginContainer);

export default container;
