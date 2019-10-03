import React from "react";
import {toast} from "react-toastify";
import styled from "styled-components";

const Button = styled.button`
  padding: 5px 10px;
  background-color: #888;
  color: #fff;
  border: none;
  font-size: 14px;
`

const PrimaryButton = styled(Button)`
    background-color: #3498DB;
    text-transform: uppercase;
`

export const notify = ({error: { message, code, status }, type, cancel, retry}) => {
    if (process.browser && (!status || status >= 500)) {
        let retrying = false;

        toast(
            <div>
                <p>
                    {message}
                </p>
                <p>
                    <small>
                        {`REF: ${[(code || type), status].filter(value => value).join("-")}`}
                    </small>
                </p>
                <p
                    className="text-right"
                >
                    {retry
                    && (
                        <PrimaryButton
                            className="primary"
                            onClick={() => {
                                retrying = true;
                            }}
                        >
                            Retry
                        </PrimaryButton>
                    )}
                    {' '}
                    {cancel
                    && (
                        <Button
                        >
                            Cancel
                        </Button>
                    )}
                </p>
            </div>,
            {
                autoClose: !(cancel || retry),
                type: 'error',
                onClose: () => {
                    if (!retrying && cancel) {
                        cancel();
                    } else if (retry) {
                        retry();
                    }
                },
            },
        );

        return true;
    }

    return false;
}
