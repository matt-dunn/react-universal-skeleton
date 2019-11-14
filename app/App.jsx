import { hot } from 'react-hot-loader';
import React from 'react'
import {Helmet} from 'react-helmet-async';
import {Switch, Route, generatePath} from 'react-router-dom'
import importComponent from 'react-imported-component';

import Header from './components/Header'
import LoadingComponent from './components/Loading'
import ErrorComponent from './components/Error'

import Error403 from './pages/403';
import Error404 from './pages/404';

import Home from './pages/Home';

import { GlobalStyles } from './styles'
import { ToastifyStyles } from './styles/toasify'

import ErrorHandler from "components/actions/ErrorHandler";

const Data = importComponent(() => import("./pages/Data"), {
    LoadingComponent,
    ErrorComponent
});

const Forms = importComponent(() => import("./pages/Forms"), {
    LoadingComponent,
    ErrorComponent
});

const MyStyled = importComponent(() => import("./pages/MyStyled"), {
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

// Parcel seems to need the node_modules path prefixed otherwise server bundle get Unexpected Token error... :(
import '/node_modules/react-responsive-ui/style.css';

const App = () => {
    return (
        <AuthProvider>
            <GlobalStyles/>
            <ToastifyStyles/>

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
                    <Route exact path="/data/:page?" render={() => <Data />} />
                    <Route exact path="/forms" render={() => <Forms />} />
                    <Route exact path="/mystyled" render={() => <MyStyled />} />
                    <Route path="/login/:from?" render={() => <Login />} />
                    <Route component={Error404} />
                    {/*<Redirect to="/" />*/}
                </Switch>
            </ErrorHandler>
        </AuthProvider>
    );
}

export default hot(module)(App);
