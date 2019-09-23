import React, {useEffect} from 'react'
import {Helmet} from 'react-helmet-async'

import Page from '../components/Page.jsx'

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

            <div>
                HOME PAGE
            </div>
        </Page>
    )
}

export default Home
