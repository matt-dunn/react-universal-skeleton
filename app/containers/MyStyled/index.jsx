import React from "react";
import {Helmet} from "react-helmet-async";

import {Main, Title} from "app/styles/Components";

import TestMyStyled from "./TestMyStyled";

const MyStyled = () => {
    return (
        <Main>
            <Helmet>
                <title>MyStyled Test</title>
            </Helmet>

            <Title>
                MyStyled Test
            </Title>

            <TestMyStyled/>
        </Main>
    );
};

export default MyStyled;
