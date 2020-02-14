import React from "react";

import {ErrorLike} from "components/error";

import {Main, Title} from "app/styles/Components";

type ErrorGlobalProps = {
    error: ErrorLike;
}

export const ErrorGlobal = ({error}: ErrorGlobalProps) => (
    <Main>
        <Title>TODO: An fatal error occurred</Title>
        <p>{error.message}</p>
    </Main>
);
