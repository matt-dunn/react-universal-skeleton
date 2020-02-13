import React from "react";

import {ErrorLike} from "components/error";

export const ErrorMain = ({error}: {error: ErrorLike}) => {
    return (
        <h1>TODO: An error occurred - {error.message}</h1>
    );
};

