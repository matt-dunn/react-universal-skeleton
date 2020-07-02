import React, {ReactNode} from "react";
import {connect} from "react-redux";
import styled from "@emotion/styled";
import * as Yup from "yup";

import {getStatus} from "components/state-mutate-with-status";
import {ButtonGroup} from "components/Buttons";
import {MapDataToAction} from "components/actions/form";
import {Collections, Form, FormContainer, Submit} from "components/Form";
import {Loading} from "components/Loading";

import {AppState} from "../../reducers";
import * as actions from "../../actions";
import {AuthState} from "../../reducers/auth";

export type User = {
    id: string;
    name: string;
    email: string;
}

type LoginProps = {
    auth: AuthState;
    login: (username: string, password: string) => Promise<User>;
    onLogin: (user: User) => void;
    className?: string;
    children?: ReactNode;
};

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

const LoginContainer = ({auth, login, onLogin, className, children}: LoginProps) => {
    const {processing} = getStatus(auth.authenticatedUser);

    const handleSubmit: MapDataToAction<Yup.InferType<typeof loginSchema>, User, typeof formState> = ({username, password}) => login(username, password)
        .then((user) => {
            onLogin(user);
            return user;
        });

    return (
        <Loading loading={processing} className={className}>
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

                        {children ||
                        <ButtonGroup className="options main">
                            <Submit>
                                Login
                            </Submit>
                        </ButtonGroup>
                        }
                    </>
                )}
            </Form>
        </Loading>
    );
};

export default connect(
    ({auth}: AppState) => ({
        auth
    }),
    {
        login: actions.authActions.login as any
    }
)(LoginContainer);
