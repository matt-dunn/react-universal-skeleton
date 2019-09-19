import React from 'react'
import {Helmet} from 'react-helmet-async'

import Page from '../components/Page.jsx'

const Home = () => (
    <Page>
        <Helmet>
            <title>Home Page</title>
        </Helmet>

        <div>
            HOME PAGE
        </div>
    </Page>
)

export default Home
