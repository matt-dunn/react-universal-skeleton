import React from "react";
import {Helmet} from "react-helmet-async";
import styled from "@emotion/styled";
import {FormattedDate, FormattedMessage} from "react-intl";

import Page from "../styles/Page";

const Title = styled.h2`
    color: #ccc;
`;

const Locale = () => {
    return (
        <Page>
            <Helmet>
                <title>Locale Test</title>
            </Helmet>

            <Title>
                <FormattedMessage
                    id="welcome"
                    defaultMessage={`Hello {name}. You have {unreadCount, number} {unreadCount, plural,
                      one {message}
                      other {messages}
                    }`}
                    values={{name: <b>Clem</b>, unreadCount: 1}}
                />
            </Title>

            <p>
                <FormattedMessage
                    id="welcome"
                    defaultMessage={`Hello {name}. You have {unreadCount, number} {unreadCount, plural,
                      one {message}
                      other {messages}
                    }`}
                    values={{name: <b>Clem</b>, unreadCount: 13}}
                />
            </p>
            <p>
                <FormattedMessage
                    id="welcome:date"
                    defaultMessage={"The date today is {date}"}
                    values={{date: <FormattedDate value={Date.now()}/>}}
                />
            </p>
        </Page>
    );
};

export default Locale;
