import React from "react";
import {Helmet} from "react-helmet-async";
import {Switch, Route, generatePath} from "react-router-dom";
import loadable from "@loadable/component";
import { Global } from "@emotion/core";

import Header from "./components/Header";

import { GlobalStyles } from "./styles";
import { ToastifyStyles } from "./styles/toasify";

import ErrorHandler, {CallHandler} from "components/actions/ErrorHandler";

import AuthProvider from "./components/auth";
import {ToastContainer} from "react-toastify";

import Error403 from "./containers/403";
import Error404 from "./containers/404";
import Home from "./containers/Home";
const Data = loadable(() => import(/* webpackPrefetch: true */ "./containers/Data"));
const Forms = loadable(() => import(/* webpackPrefetch: true */ "./containers/Forms"));
const MyStyled = loadable(() => import(/* webpackPrefetch: true */ "./containers/MyStyled"));
const Login = loadable(() => import(/* webpackPrefetch: true */ "./containers/Login"));
const Locale = loadable(() => import(/* webpackPrefetch: true */ "./containers/Locale"));
const State = loadable(() => import(/* webpackPrefetch: true */ "./containers/State"));
const Dashboard = loadable(() => import(/* webpackPrefetch: true */ "./containers/Dashboard"));

import "./styles/react-responsive-ui.css";

const handler: CallHandler = ({code, status, message}, location, history) => {
    console.error("HANDLE ERROR", message, code, status, location);

    if (status === 401) {
        history.push(generatePath("/login/:from?", {from: location}));
        return true;
    } else if (status === 403) {
        return <Error403/>;
    } else if (status === 404) {
        return <Error404/>;
    }

    return false;
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
                <meta name="description" content="Universal App Form Page" />
                <meta name="keywords" content="forms,..." />
            </Helmet>

            <Header/>

            <ErrorHandler handler={handler}>
                <Switch>
                    <Route exact path="/" component={Home} />
                    <Route exact path="/data/:page?/" component={Data} />
                    <Route exact path="/forms/" component={Forms} />
                    <Route exact path="/mystyled/" component={MyStyled} />
                    <Route exact path="/locale/" component={Locale} />
                    <Route exact path="/state/" component={State} />
                    <Route exact path="/dashboard/" component={Dashboard} />
                    <Route path="/login/:from?/" component={Login} />
                    <Route component={Error404} />
                    {/*<Redirect to="/" />*/}
                </Switch>
            </ErrorHandler>
        </AuthProvider>
    );
};

export default process.env.NODE_ENV === "production" ? App : require("react-hot-loader").hot(module)(App);
