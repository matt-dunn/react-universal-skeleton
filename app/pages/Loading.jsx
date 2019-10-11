import React from 'react'
import styled from "styled-components";

import Page from '../styles/Page'

const Title = styled.div`
    color: #ccc;
    font-size: 10px;
`

const Loading = () => (
    <Page>
        <Title>
            Loading...
        </Title>
    </Page>
)

export default Loading
