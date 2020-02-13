import React from "react";

import {ErrorLike} from "components/error";

export const ErrorGlobal = ({error}: {error: ErrorLike}) => {
    return (
        <h1>TODO: An fatal error occurred - {error.message}</h1>
    );
};
