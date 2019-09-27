import React from 'react'

import Page from '../components/Page.jsx'
import { useParams, useHistory } from "react-router-dom";

const Login = () => {
    const {from} = useParams() || "/";
    const history = useHistory();

    return (
        <Page>
            Login

            <button
                onClick={() => {
                    window.authenticated = true;
                    history.replace(decodeURIComponent(from))
                }}
            >
                LOGIN
            </button>
        </Page>
    )
}

export default Login
