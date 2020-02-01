import React from "react";
import {toast} from "react-toastify";

import {Notification} from "components/notification";

export const notify = ({message, severity, reference}: Notification) => {
    if ((process as any).browser) {
        toast(
            <>
                {message}

                {reference &&
                <p>
                    <small>
                        {`REF: ${reference}`}
                    </small>
                </p>
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
