import React from 'react'
import {Helmet} from 'react-helmet-async';
import {Switch, Route} from 'react-router-dom'
import importComponent from 'react-imported-component';

import Header from './components/Header'

import Error404 from './pages/404';
import Home from './pages/Home';
import LoadingComponent from './pages/Loading'
import ErrorComponent from './pages/Error'

import { GlobalStyles } from './styles'
import { ToastifyStyles } from './styles/toasify'

import {ErrorHandler} from "./components/context";

const About = importComponent(() => import("./pages/About"), {
    LoadingComponent,
    ErrorComponent
});

const Login = importComponent(() => import("./pages/Login"), {
    LoadingComponent,
    ErrorComponent
});

const App = (props) => {
    console.error(props)
    return (
        <React.Fragment>
            <GlobalStyles/>
            <ToastifyStyles/>

            <Helmet>
                <title>My App</title>
            </Helmet>

            <Header/>

            <ErrorHandler>
                <Switch>
                    <Route exact path="/" component={Home} />
                    <Route exact path="/about" render={() => <About />} />
                    <Route path="/login/:from?" render={() => <Login />} />
                    <Route component={Error404} />
                    {/*<Redirect to="/" />*/}
                </Switch>
            </ErrorHandler>
        </React.Fragment>
    );
}

export default App;
