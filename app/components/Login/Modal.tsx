import React, {useEffect} from "react";

import {ModalTitle, useModal} from "components/Modal";
import {withWireFrameAnnotation} from "components/Wireframe";

import {User} from "./";

import LoginComponent from "./";

type LoginModalProps = {
    onLogin?: (user: User) => void;
}

const WALoginComponent = withWireFrameAnnotation(LoginComponent, {
    title: <div>Modal submit button</div>,
    description: <div>Only enabled once the data is available.</div>
});

const LoginModal = ({onLogin}: LoginModalProps) => {
    const [modal, open, close] = useModal({});

    useEffect(() => {
        const handleLogin = (user: User) => {
            close();

            onLogin && onLogin(user);
        };

        open(() => {
            return (
                <>
                    <WALoginComponent onLogin={handleLogin}/>
                    <ModalTitle hasClose={false}>Login</ModalTitle>
                </>
            );
        }, {
            isStatic: true
        });
    }, [close, onLogin, open]);

    return <div>{modal()}</div>;
};

export default LoginModal;
