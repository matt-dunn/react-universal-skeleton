import React from 'react'
import { renderToNodeStream } from 'react-dom/server'
import { HelmetProvider } from 'react-helmet-async'
import { StaticRouter } from 'react-router-dom'
import { ServerStyleSheet } from 'styled-components'
import { printDrainHydrateMarks } from 'react-imported-component';
import log from 'llog'
import through from 'through'
import App from '../../app/App'
import { getHTMLFragments } from './client'

import { Provider } from 'react-redux';

import getStore from "../../app/store";

import {getDataFromTree} from "../../app/components/context";

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

if (!('toJSON' in Error.prototype)) {
    Object.defineProperty(Error.prototype, 'toJSON', {
        value: function () {
            const {stack, ...rest} = Object.getOwnPropertyNames(this).reduce((o, key) => {
                o[key] = this[key];
                return o;
            }, {});

            return rest;
        },
        configurable: true,
        writable: true
    });
}

export default async (req, res) => {
    const store = getStore();

    const context = {};
    const helmetContext = {};

    const app = (
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
    );

    try {
        const sheet = new ServerStyleSheet()

        await getDataFromTree(sheet.collectStyles(app));

        const stream = sheet.interleaveWithNodeStream(
            renderToNodeStream(sheet.collectStyles(app))
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
                                    window.__PRELOADED_STATE__ = ${JSON.stringify(store.getState()).replace(
                                    /</g,
                                    '\\u003c'
                                )}
                                </script>`
                            )
                            this.queue(endingHTMLFragment)
                            this.queue(null)
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
