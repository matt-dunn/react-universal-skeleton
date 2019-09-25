import React from 'react'
import {Helmet} from 'react-helmet-async';
import {Switch, Route} from 'react-router-dom'
import importComponent from 'react-imported-component';

import Header from './components/Header'

import Home from './pages/Home';
import LoadingComponent from './pages/Loading'
import ErrorComponent from './pages/Error'

import { GlobalStyles } from './styles'
import { ToastifyStyles } from './styles/toasify'

const About = importComponent(() => import("./pages/About"), {
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

            <Switch>
                <Route exact path="/" component={Home} />
                <Route exact path="/about" render={() => <About />} />
                {/*<Redirect to="/" />*/}
            </Switch>
        </React.Fragment>
    );
}

export default App;
