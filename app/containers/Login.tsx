import React from "react";
import { useParams, useHistory } from "react-router-dom";
import {connect} from "react-redux";
import styled from "@emotion/styled";

import {AppState} from "app/reducers";
import * as actions from "app/actions";
import {Main, Title} from "app/styles/Components";

import Login from "app/components/Login";

const LoginForm = styled(Login)`
  max-width: 300px;
  margin: 10px auto;
`;

const LoginContainer = () => {
    const {from} = useParams() || "/";
    const history = useHistory();

    const handleLogin = () => {
        history.replace((from && decodeURIComponent(from)) || "/");
    };

    return (
        <Main>
            <Title>
                Simple Login
            </Title>

            <LoginForm onLogin={handleLogin}/>
        </Main>
    );
};

const container = connect(
    ({auth}: AppState) => ({
        auth
    }),
    {
        login: actions.authActions.login
    }
)(LoginContainer);

export default container;
