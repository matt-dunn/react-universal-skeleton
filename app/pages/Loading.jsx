import React from 'react'

import Page from '../components/Page.jsx'
import styled from "styled-components";

const Title = styled.div`
    color: red;
    font-size: 50px;
`

const Loading = () => (
    <Page>
        <Title>
            Loading...
        </Title>
    </Page>
)

export default Loading
