import React, {useEffect} from "react";

import {ModalTitle, useModal} from "components/Modal";

import {User} from "../api/auth";

import LoginComponent from "./";

type LoginModalProps = {
    onLogin?: (user: User) => void;
}

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
                    <LoginComponent onLogin={handleLogin}/>
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
