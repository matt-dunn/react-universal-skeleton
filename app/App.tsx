import React from "react";
import {Helmet} from "react-helmet-async";
import {Switch, Route, generatePath} from "react-router-dom";
import loadable from "@loadable/component";
import { Global } from "@emotion/core";
import styled from "@emotion/styled";

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

const Container = styled.section`
  display: grid;
  min-height: 100vh;
  max-width: 100%;
  grid-template-columns: 1fr;
  grid-template-rows: min-content auto min-content;
  grid-template-areas: "head" "main" "footer";
`;

const HeaderContainer = styled(Header)`
  grid-area: head;
  border-bottom: 3px solid #eee;
  background-color: #f5f5f5;
`;

const MainContainer = styled(ErrorBoundary)`
  grid-area: main;
`;

const FooterContainer = styled.footer`
  grid-area: footer;
  padding: 0.5rem 1rem;
  border-top: 1px solid #eee;
  color: #888;
  background-color: #f5f5f5;
  margin-top: 1rem;
`;

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

                    <Container>
                        <HeaderContainer/>

                        <MainContainer ErrorComponent={ErrorMain}>
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
                        </MainContainer>

                        <FooterContainer className="align-right">
                            <a href="mailto:matt.j.dunn@gmail.com">Matt Dunn</a>
                        </FooterContainer>
                    </Container>
                </AuthProvider>
            </ErrorBoundary>
        </>
    );
};

export default process.env.NODE_ENV === "production" ? App : require("react-hot-loader").hot(module)(App);
