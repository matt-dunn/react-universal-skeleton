import React from "react";

import {ErrorLike} from "components/error";

import {Main, Title} from "app/styles/Components";

type ErrorMainProps = {
    error: ErrorLike;
}

export const ErrorMain = ({error}: ErrorMainProps) => (
    <Main>
        <Title>TODO: An error occurred</Title>
        <p>{error.message}</p>
    </Main>
);
