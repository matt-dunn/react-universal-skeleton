import React from "react";
import {toast} from "react-toastify";
import styled from "@emotion/styled";

import {Notification, Severity} from "components/notification";

const Reference = styled.cite`
    margin: 10px 0 0 0;
    display: block;
    font-size: 0.6em;
    font-weight: normal;
    font-style: normal;
    text-align: right;
`;

export const notify = ({message, severity = Severity.info, reference}: Notification) => {
    if ((process as any).browser) {
        toast(
            <>
                {message}

                {reference &&
                <Reference>
                    {`REF: ${reference}`}
                </Reference>
                }
            </>,
            {
                type: severity
            },
        );

        return true;
    }

    return false;
};
