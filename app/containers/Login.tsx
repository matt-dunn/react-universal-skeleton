import React from "react";
import { useParams, useHistory } from "react-router-dom";
import {connect} from "react-redux";
import styled from "@emotion/styled";

import {getStatus} from "components/state-mutate-with-status";
import {ButtonPrimary} from "components/Buttons";

import {AppState} from "../reducers";
import * as actions from "../actions";
import Page from "../styles/Page";
import {AuthState} from "../reducers/auth";
import {Login} from "../components/api";

import useWhatChanged from "components/whatChanged/useWhatChanged";

export type LoginProps = {
    auth: AuthState;
    login: Login;
};

const Title = styled.h2`
    color: #ccc;
    margin-bottom: 20px;
`;

const LoginContainer = ({auth, login}: LoginProps, ...props: any[]) => {
    const {from} = useParams() || "/";
    const history = useHistory();
    const {processing} = getStatus(auth.authenticatedUser);

    useWhatChanged(LoginContainer, { auth, login, ...props });

    return (
        <Page>
            <Title>
                Simple Login
            </Title>

            <ButtonPrimary
                disabled={processing}
                onClick={() => {
                    login("clem@demo.com", "xxx")
                        .then(() => {
                            history.replace((from && decodeURIComponent(from)) || "/");
                        });
                }}
            >
                LOGIN
            </ButtonPrimary>
        </Page>
    );
};

const container = connect(
    ({auth}: AppState) => ({
        auth
    } as LoginProps),
    {
        login: actions.authActions.login
    }
)(LoginContainer);

export default container;
