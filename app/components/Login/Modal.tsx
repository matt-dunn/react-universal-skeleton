import React, {useEffect} from "react";

import {ModalTitle, useModal} from "components/Modal";

import LoginComponent from "./";

const LoginModal = () => {
    const [modal, open, close] = useModal({});

    useEffect(() => {
        const handleLogin = () => {
            close();
            // TODO: Reload the component tree / window.reload?
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
    }, [close, open]);

    return <div>{modal()}</div>;
};

export default LoginModal;
