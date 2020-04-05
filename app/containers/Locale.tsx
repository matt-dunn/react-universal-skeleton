import React from "react";
import {Helmet} from "react-helmet-async";
import {FormattedDate, FormattedMessage} from "react-intl";

import {Main, Title} from "app/styles/Components";

import {withWireframeAnnotation} from "@matt-dunn/react-wireframes";

const WAMessageTitle = withWireframeAnnotation({
    title: "Page title",
    description: "Locale page title. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos."
})(Title);

const WAMessageDate = withWireframeAnnotation( {
    title: "Localised date",
    description: "Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos."
})("p");

const Locale = () => (
    <Main>
        <Helmet>
            <title>Locale Test</title>
        </Helmet>

        <WAMessageTitle>
            <FormattedMessage
                defaultMessage={`Hello {name}. You have {unreadCount, number} {unreadCount, plural,
                      one {message}
                      other {messages}
                    }`}
                values={{name: <b>Clem</b>, unreadCount: 1}}
                description="Main locale page title"
            />
        </WAMessageTitle>

        <p>
            <FormattedMessage
                defaultMessage={`Hello {name}. You have {unreadCount, number} {unreadCount, plural,
                      one {message}
                      other {messages}
                    }`}
                values={{name: <b>Clem</b>, unreadCount: 13}}
                description="Main locale page title"
            />
        </p>
        <WAMessageDate>
            <FormattedMessage
                defaultMessage={"The date today is {date}"}
                values={{date: <FormattedDate value={Date.now()}/>}}
                description="The locale date now"
            />
        </WAMessageDate>
    </Main>
);

export default Locale;
