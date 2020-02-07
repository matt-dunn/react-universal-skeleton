import React from "react";
import { useParams, useHistory } from "react-router-dom";
import {connect} from "react-redux";
import styled from "@emotion/styled";
import * as Yup from "yup";

import {getStatus} from "components/state-mutate-with-status";
import {ButtonGroup} from "components/Buttons";
import {MapDataToAction} from "components/actions/form";
import {Collections, Form, FormContainer} from "components/Form";
import {Submit} from "components/Form/FormOptions/Submit";
import Loading from "components/Loading";

import {AppState} from "../reducers";
import * as actions from "../actions";
import Page from "../styles/Page";
import {AuthState} from "../reducers/auth";
import {Login, User} from "../components/api";

import useWhatChanged from "components/whatChanged/useWhatChanged";

export type LoginProps = {
    auth: AuthState;
    login: Login;
};

const Title = styled.h2`
    color: #ccc;
    margin-bottom: 20px;
`;

const Main = styled(Loading)`
  max-width: 300px;
  margin: 10px auto;
`;

const LoginForm = styled(FormContainer)``;

const loginSchema = Yup.object().shape({
    username: Yup.string()
        .label("Email")
        .email()
        .required()
        .ensure(),
    password: Yup.string()
        .label("Password")
        .required()
        .ensure()
        .meta({
            props: {
                type: "password"
            }
        })
});

const formState = {
    authToken: "*****"
};

const LoginContainer = ({auth, login}: LoginProps, ...props: any[]) => {
    const {from} = useParams() || "/";
    const history = useHistory();
    const {processing} = getStatus(auth.authenticatedUser);

    const handleSubmit: MapDataToAction<Yup.InferType<typeof loginSchema>, User, typeof formState> = values => login(values.username, values.password)
        .then((user) => {
            history.replace((from && decodeURIComponent(from)) || "/");
            return user;
        });

    useWhatChanged(LoginContainer, { auth, login, ...props });

    return (
        <Page>
            <Title>
                Simple Login
            </Title>

            <Main loading={processing}>
                <Form
                    id="login"
                    as={LoginForm}
                    schema={loginSchema}
                    context={formState}
                    onSubmit={handleSubmit}
                >
                    {({fieldsetMap}) => (
                        <>
                            <Collections fieldsetMap={fieldsetMap}/>

                            <ButtonGroup className="options main">
                                <Submit>
                                    Login
                                </Submit>
                            </ButtonGroup>
                        </>
                    )}
                </Form>
            </Main>
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
