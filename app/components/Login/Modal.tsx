import React, {useEffect} from "react";

import {ModalTitle, useModal} from "components/Modal";
import {withWireFrameAnnotation} from "@matt-dunn/react-wireframes";

import {User} from "./";

import LoginComponent from "./";

type LoginModalProps = {
    onLogin?: (user: User) => void;
}

const WALoginComponent = withWireFrameAnnotation(LoginComponent, {
    title: "Modal login",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam iaculis convallis ante, ac porttitor eros hendrerit non. Ut a hendrerit ligula. Praesent vestibulum, dui venenatis convallis condimentum, lorem magna rutrum erat, eget convallis odio purus sed ex. Suspendisse congue metus ac blandit vehicula. Suspendisse non elementum purus. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos."
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
