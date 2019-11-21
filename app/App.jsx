import "babel-polyfill";

// import { hot } from 'react-hot-loader';
import React from "react";
import {Helmet} from "react-helmet-async";
import {Switch, Route, generatePath} from "react-router-dom";
import loadable from "@loadable/component";
import { Global } from "@emotion/core";

import Header from "./components/Header";

import Error403 from "./pages/403";
import Error404 from "./pages/404";

import Home from "./pages/Home";

import { GlobalStyles } from "./styles";
import { ToastifyStyles } from "./styles/toasify";

import ErrorHandler from "components/actions/ErrorHandler";

import AuthProvider from "./components/auth";
import {ToastContainer} from "react-toastify";

import "./styles/react-responsive-ui.css";

const handler = ({code, status}, location, history) => {
    console.log("HANDLE ERROR", code, status, location, history);

    if (status === 401) {
        history.push(generatePath("/login/:from?", {from: location}));
        return true;
    } else if (status === 403) {
        return <Error403/>;
    } else if (status === 404) {
        return <Error404/>;
    }
};

const App = () => {
    return (
        <AuthProvider>
            <ToastContainer
                hideProgressBar
                pauseOnHover
            />
            <Global styles={GlobalStyles}/>
            <Global styles={ToastifyStyles}/>

            <Helmet
                titleTemplate="%s - Universal App Example"
            >
                <title>Universal App Example</title>
                <meta name="build.version" content={process.env.npm_package_version + ((process.env.NODE_ENV !== "production" && "-dev") || "")}/>
            </Helmet>

            <Header/>

            <ErrorHandler handler={handler}>
                <Switch>
                    <Route exact path="/" component={Home} />
                    <Route exact path="/data/:page?" component={loadable(() => import(/* webpackPrefetch: true */ "./pages/Data"))} />
                    <Route exact path="/forms" component={loadable(() => import(/* webpackPrefetch: true */ "./pages/Forms"))} />
                    <Route exact path="/mystyled" component={loadable(() => import(/* webpackPrefetch: true */ "./pages/MyStyled"))} />
                    <Route path="/login/:from?" component={loadable(() => import(/* webpackPrefetch: true */ "./pages/Login"))} />
                    <Route component={Error404} />
                    {/*<Redirect to="/" />*/}
                </Switch>
            </ErrorHandler>
        </AuthProvider>
    );
};

// export default hot(module)(App);
export default App;
