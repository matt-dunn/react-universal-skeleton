import React from "react";
import {Helmet} from "react-helmet-async";
import {Switch, Route, generatePath} from "react-router-dom";
import loadable from "@loadable/component";
import { Global } from "@emotion/core";

import Header from "./components/Header";

import { GlobalStyles } from "./styles";
import { ToastifyStyles } from "./styles/toasify";

import ErrorHandler from "components/actions/ErrorHandler";

import AuthProvider from "./components/auth";
import {ToastContainer} from "react-toastify";

import Error403 from "./containers/403";
import Error404 from "./containers/404";
import Home from "./containers/Home";
const Data = loadable(() => import(/* webpackPrefetch: true */ "./containers/Data"));
const Forms = loadable(() => import(/* webpackPrefetch: true */ "./containers/Forms"));
const MyStyled = loadable(() => import(/* webpackPrefetch: true */ "./containers/MyStyled"));
const Login = loadable(() => import(/* webpackPrefetch: true */ "./containers/Login"));

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
            </Helmet>

            <Header/>

            <ErrorHandler handler={handler}>
                <Switch>
                    <Route exact path="/" component={Home} />
                    <Route exact path="/data/:page?" component={Data} />
                    <Route exact path="/forms" component={Forms} />
                    <Route exact path="/mystyled" component={MyStyled} />
                    <Route path="/login/:from?" component={Login} />
                    <Route component={Error404} />
                    {/*<Redirect to="/" />*/}
                </Switch>
            </ErrorHandler>
        </AuthProvider>
    );
};

export default process.env.NODE_ENV === "production" ? App : require("react-hot-loader").hot(module)(App);
