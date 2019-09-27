import React from 'react'

import Page from '../components/Page.jsx'
import { useRouteMatch } from "react-router-dom";

const Login = () => {
    console.log("MATCH", useRouteMatch())
    return (
        <Page>
            Login
        </Page>
    )
}

export default Login
