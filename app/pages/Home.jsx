import React from 'react'
import {Helmet} from 'react-helmet-async'
import styled from "styled-components";

import Page from '../styles/Page'

const Title = styled.h2`
    color: #ccc;
`;

const Home = () => {
    return (
        <Page>
            <Helmet>
                <title>Home Page</title>
            </Helmet>

            <Title>
                Home page
            </Title>

        </Page>
    )
};

export default Home
