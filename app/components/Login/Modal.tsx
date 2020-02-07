import React, {useEffect} from "react";

import {useModal} from "components/Modal";

import LoginComponent from "./";

const LoginModal = () => {
    const [modal, open, close] = useModal({});

    useEffect(() => {
        const handleLogin = () => {
            close();
            // window.location.reload()
        };

        open(() => {
            return (
                <LoginComponent onLogin={handleLogin}/>
            );
        });
    }, [close, open]);

    return <div>{modal()}</div>;
};

export default LoginModal;
