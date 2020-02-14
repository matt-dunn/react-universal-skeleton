import React from "react";
import {Helmet} from "react-helmet-async";
import {Switch, Route, generatePath} from "react-router-dom";
import loadable from "@loadable/component";
import { Global } from "@emotion/core";

import Header from "./components/Header";

import { GlobalStyles } from "./styles/global";
import { ToastifyStyles } from "./styles/toasify";

import ErrorHandler, {HandleError} from "components/actions/ErrorHandler";

import AuthProvider from "./components/auth";
import {ToastContainer} from "react-toastify";

import ErrorBoundary from "./components/ErrorBoundary";
import {ErrorMain} from "./components/error/ErrorMain";
import {ErrorGlobal} from "./components/error/ErrorGlobal";

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
const LoginModal = loadable(() => import(/* webpackPrefetch: true */ "./components/Login/Modal"));

import "./styles/react-responsive-ui.css";

const handler: HandleError = ({code, status, message}, location, history, props, update) => {
    console.error("HANDLE ERROR", message, code, status, location);

    if (status === 401) {
        if ((process as any).browser) {
            return {
                component: <LoginModal onLogin={update}/>,
                includeChildren: true,

            };
        } else {
            history.push(generatePath("/login/:from?/", {from: location}));
        }
    } else if (status === 403) {
        return {
            component: <Error403/>
        };
    } else if (status === 404) {
        return {
            component: <Error404/>
        };
    }
};

const App = () => {
    return (
        <>
            <Global styles={GlobalStyles}/>

            <ErrorBoundary ErrorComponent={ErrorGlobal}>
                <AuthProvider>
                    <ToastContainer
                        hideProgressBar
                        pauseOnHover
                    />
                    <Global styles={ToastifyStyles}/>

                    <Helmet
                        titleTemplate="%s - Universal App Example"
                    >
                        <title>Universal App Example</title>
                        <meta name="description" content="Universal App Form Page"/>
                        <meta name="keywords" content="forms,..."/>
                    </Helmet>

                    <Header/>

                    <ErrorBoundary ErrorComponent={ErrorMain}>
                        <ErrorHandler handler={handler}>
                            <Switch>
                                <Route exact path="/" component={Home}/>
                                <Route exact path="/data/:page?/" component={Data}/>
                                <Route exact path="/forms/" component={Forms}/>
                                <Route exact path="/mystyled/" component={MyStyled}/>
                                <Route exact path="/locale/" component={Locale}/>
                                <Route exact path="/state/" component={State}/>
                                <Route exact path="/dashboard/" component={Dashboard}/>
                                <Route path="/login/:from?/" component={Login}/>
                                <Route component={Error404}/>
                                {/*<Redirect to="/" />*/}
                            </Switch>
                        </ErrorHandler>
                    </ErrorBoundary>
                </AuthProvider>
            </ErrorBoundary>
        </>
    );
};

export default process.env.NODE_ENV === "production" ? App : require("react-hot-loader").hot(module)(App);
