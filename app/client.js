import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import { HelmetProvider } from 'react-helmet-async';
import { BrowserRouter } from 'react-router-dom'
import { rehydrateMarks } from 'react-imported-component';
import importedComponents from './imported'; // eslint-disable-line

import { Provider } from 'react-redux';

import store from "./store";

console.error(store.getState())

const element = document.getElementById('app')

const app = (
    <HelmetProvider>
        <Provider store={store}>
            <BrowserRouter>
                <App />
            </BrowserRouter>
        </Provider>
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
