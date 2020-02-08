import React from "react";
import { useParams, useHistory } from "react-router-dom";
import {connect} from "react-redux";
import styled from "@emotion/styled";

import {AppState} from "../reducers";
import * as actions from "../actions";
import Page from "../styles/Page";
import Login from "app/components/Login";

const Title = styled.h2`
    color: #ccc;
    margin-bottom: 20px;
`;

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
        <Page>
            <Title>
                Simple Login
            </Title>

            <LoginForm onLogin={handleLogin}/>
        </Page>
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
