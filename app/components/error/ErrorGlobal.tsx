import React from "react";

import {ErrorLike} from "components/error";

import {Main, Title} from "app/styles/Components";

export const ErrorGlobal = ({error}: {error: ErrorLike}) => {
    return (
        <Main>
            <Title>TODO: An fatal error occurred</Title>
            <p>{error.message}</p>
        </Main>
    );
};
