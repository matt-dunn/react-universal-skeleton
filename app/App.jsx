import { hot } from 'react-hot-loader';
import React from 'react'
import {Helmet} from 'react-helmet-async';
import {Switch, Route, generatePath} from 'react-router-dom'
import importComponent from 'react-imported-component';

import Header from './components/Header'

import Error403 from './pages/403';
import Error404 from './pages/404';

import Home from './pages/Home';
import LoadingComponent from './pages/Loading'
import ErrorComponent from './pages/Error'

import { GlobalStyles } from './styles'
import { ToastifyStyles } from './styles/toasify'

import ErrorHandler from "components/actions/ErrorHandler";

const About = importComponent(() => import("./pages/About"), {
    LoadingComponent,
    ErrorComponent
});

const Login = importComponent(() => import("./pages/Login"), {
    LoadingComponent,
    ErrorComponent
});

const handler = ({code, status}, location, history, props) => {
    console.log("HANDLE ERROR", code, status, location, history)

    if (status === 401) {
        history.push(generatePath("/login/:from?", {from: location}))
        return true;
    } else if (status === 403) {
        return <Error403/>;
    } else if (status === 404) {
        return <Error404/>;
    }
}

import AuthProvider from "./components/auth"

const App = () => {
    return (
        <AuthProvider>
            <GlobalStyles/>
            <ToastifyStyles/>

            <Helmet>
                <title>My App</title>
                <meta name="build.version" content={process.env.npm_package_version + ((process.env.NODE_ENV !== "production" && "-dev") || "")}/>
            </Helmet>

            <Header/>

            <ErrorHandler handler={handler}>
                <Switch>
                    <Route exact path="/" component={Home} />
                    <Route exact path="/about/:page?" render={() => <About />} />
                    <Route path="/login/:from?" render={() => <Login />} />
                    <Route component={Error404} />
                    {/*<Redirect to="/" />*/}
                </Switch>
            </ErrorHandler>
        </AuthProvider>
    );
}

export default hot(module)(App);
