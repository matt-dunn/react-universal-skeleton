import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import { HelmetProvider } from 'react-helmet-async';
import { BrowserRouter } from 'react-router-dom'
import { rehydrateMarks } from 'react-imported-component';
import importedComponents from './imported'; // eslint-disable-line

import { GlobalStyles } from './styles'

const element = document.getElementById('app')

const app = (
    <HelmetProvider>
        <BrowserRouter>
            <GlobalStyles/>
            <App />
        </BrowserRouter>
    </HelmetProvider>
);

if (process.env.NODE_ENV === 'production') {
    // rehydrate the bundle marks
    rehydrateMarks().then(() => {
        ReactDOM.hydrate(app, element);
    });
} else {
    ReactDOM.render(app, element);
}

if (module.hot) {
    module.hot.accept();
}
