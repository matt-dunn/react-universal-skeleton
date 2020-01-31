import React from "react";
import {toast} from "react-toastify";

import {Notification} from "components/redux/middleware/sagaNotification";

export const notify = ({message, severity, reference}: Notification) => {
    if ((process as any).browser) {
        toast(
            <>
                <p>
                    {message}
                </p>
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
