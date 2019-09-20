import React from 'react'
import {Helmet} from 'react-helmet-async'

import Page from '../components/Page.jsx'
import styled from "styled-components";

const Load = styled.div`
    color: blue;
    font-size: 50px;
`

const About = () => (
    <Page>
        <Helmet>
            <title>About Page</title>
        </Helmet>
        <Load>
            This is the about page!!!
        </Load>
    </Page>
)

export default About
