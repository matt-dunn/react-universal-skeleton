import React from 'react'
import { renderToNodeStream } from 'react-dom/server'
import { HelmetProvider } from 'react-helmet-async'
import { StaticRouter } from 'react-router-dom'
import { ServerStyleSheet } from 'styled-components'
import { printDrainHydrateMarks } from 'react-imported-component';
import log from 'llog'
import through from 'through'
// import App from '../../app/App'
import App from '../../app/TestMyStyled'
import { getHTMLFragments } from './client'
import {serialize} from "components/state-mutate-with-status/utils";

import { Provider } from 'react-redux';

import getStore from "../../app/store";

import {getDataFromTree} from "components/actions";
import ErrorProvider from "components/actions/ErrorProvider";
import {errorLike} from "components/error";

import {ServerStylesheet as Stylesheet} from "components/myStyled";

const parseHelmetTemplate = helmet => (template, ...vars) => {
    const matcher = /{(\w*)}/g;

    return helmet && template && template.map(
        item => item.trim()
            .replace(matcher, (value, prop) => (helmet[prop] && helmet[prop].toString()) || "")
    )
        .reduce((acc, item, i) => {
            acc.push(item);
            vars[i] && acc.push(vars[i])
            return acc;
        }, [])
        .join("") || "";
};

export default async (req, res) => {
    const t1 = Date.now();
    const store = getStore();

    const context = {};
    const helmetContext = {};
    const errorContext = {};

    const app = (
        <ErrorProvider value={errorContext}>
            <HelmetProvider context={helmetContext}>
                <Provider store={store}>
                    <StaticRouter
                        location={req.originalUrl}
                        context={context}
                    >
                        <App/>
                    </StaticRouter>
                </Provider>
            </HelmetProvider>
        </ErrorProvider>
    );

    try {
        const sheet = new ServerStyleSheet()

        const stylesheet = Stylesheet()

        await getDataFromTree(stylesheet.collectStyles(sheet.collectStyles(app)));

        const stream = sheet.interleaveWithNodeStream(
            renderToNodeStream(stylesheet.collectStyles(sheet.collectStyles(app)))
        )

        if (context.url) {
            console.log("REDIRECT:", context.url)
            res.redirect(301, context.url);
        } else {
            const [
                startingHTMLFragment,
                endingHTMLFragment
            ] = getHTMLFragments({drainHydrateMarks: printDrainHydrateMarks()})

            const headString = "<head>"
            const splitter = '###SPLIT###'

            const [openHead, closeHead] = startingHTMLFragment
                .replace(headString, `${headString}${splitter}`)
                .split(splitter)

            const {helmet} = helmetContext;

            res.status(200)
            res.write(`
                ${openHead}
                ${parseHelmetTemplate(helmet)`
                {title}{meta}
                <link rel="canonical" href="${req.protocol}://${req.hostname}${req.originalUrl}" />
                `}
                ${stylesheet.getStyles()}
                ${closeHead}
            `.trim())
            stream
                .pipe(
                    through(
                        function write(data) {
                            this.queue(data)
                        },
                        function end() {
                            this.queue(
                                `<script>
                                    window.__PRELOADED_STATE__ = ${serialize(store.getState()).replace(
                                    /</g,
                                    '\\u003c'
                                )}
                                    window.__PRERENDERED_SSR__ = true;
                                    window.__ERROR_STATE__ = ${JSON.stringify(errorContext && errorContext.error && errorLike(errorContext.error))}
                                </script>`
                            )
                            this.queue(endingHTMLFragment)
                            this.queue(null)
                            console.log("----DONE", Date.now() - t1)
                        }
                    )
                )
                .pipe(res)
        }
    } catch (e) {
        log.error(e)
        res.status(500)
        res.end()
    }
}
