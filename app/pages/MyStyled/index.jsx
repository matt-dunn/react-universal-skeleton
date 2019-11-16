import React, {useEffect} from 'react'
import {Helmet} from 'react-helmet-async'
import styled from '@emotion/styled'

import Page from '../../styles/Page'
import TestMyStyled from "./TestMyStyled";

const Title = styled.h2`
    color: #ccc;
`;
const MyStyled = () => {
    return (
        <Page>
            <Helmet>
                <title>MyStyled Test</title>
            </Helmet>

            <Title>
                MyStyled Test
            </Title>

            <TestMyStyled/>
        </Page>
    )
};

export default MyStyled
