import React from "react";
import { renderToStaticMarkup } from 'react-dom/server'

import {APIContext} from "./contexts";

export const getDataFromTree = app => {
    const apiContext = [];

    const html = renderToStaticMarkup(
        React.createElement(
            APIContext.Provider,
            {value: apiContext},
            app
        )
    );

    return Promise.all(apiContext)
        .then(() => html)
        .catch(ex => console.error(ex)) // Swallow exceptions - they should be handled by the app...
}

export default getDataFromTree;
