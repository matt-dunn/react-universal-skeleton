import React, {useEffect} from 'react'
import {Helmet} from 'react-helmet-async'
import styled from "styled-components";

import Page from '../styles/Page'

const Title = styled.h2`
    color: #ccc;
`;
const Home = () => {
    console.log("******HOME RENDER")
    useEffect(() => {
        console.log("******HOME HOOK")
    }, []);

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
}

export default Home
