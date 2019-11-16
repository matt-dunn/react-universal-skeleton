import React from 'react'
import { renderToNodeStream } from 'react-dom/server'
import { HelmetProvider } from 'react-helmet-async'
import { StaticRouter } from 'react-router-dom'
import log from 'llog'
import through from 'through'
import 'babel-polyfill';
import { getHTMLFragments } from './client'
import {serialize} from "components/state-mutate-with-status/utils";
import { ChunkExtractor } from '@loadable/server'
import {FormDataProvider, parseFormData} from "components/actions/form";
import {set} from "lodash";
import path from "path";
import { Provider } from 'react-redux';

import {getDataFromTree} from "components/actions";
import ErrorProvider from "components/actions/ErrorProvider";
import {errorLike} from "components/error";
import StylesheetServer from "components/myStyled/server";

import getStore from "../../app/store";
import App from '../../app/App'

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

const statsFile = path.resolve('dist/client/loadable-stats.json');

export default async (req, res) => {
    const t1 = Date.now();
    const store = getStore();

    const context = {};
    const helmetContext = {};
    const errorContext = {};
    const postData = req.method === "POST" && Object.keys(req.body).reduce((o, key) => {
        set(o, key, req.body[key])
        return o;
    }, {});
    const formData = parseFormData(req.method === "POST" && postData);

    console.log("FORMDATA", formData)

    const extractor = new ChunkExtractor({ statsFile });

    const app = extractor.collectChunks(
        <FormDataProvider value={formData}>
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
        </FormDataProvider>
    );

    try {
        const stylesheetServer = StylesheetServer()

        await getDataFromTree(stylesheetServer.collectStyles(app));

        const stream = stylesheetServer.interleaveWithNodeStream(
            renderToNodeStream(stylesheetServer.collectStyles(app))
        );

        if (context.url) {
            console.log("REDIRECT:", context.url)
            res.redirect(301, context.url);
        } else {
            const scriptTags = extractor.getScriptTags();
            const linkTags = extractor.getLinkTags();
            const styleTags = extractor.getStyleTags();

            const [
                startingHTMLFragment,
                endingHTMLFragment
            ] = getHTMLFragments()

            const headString = "<head>"
            const splitter = '###SPLIT###'

            const [openHead, closeHead] = startingHTMLFragment
                .replace(headString, `${headString}${splitter}`)
                .split(splitter)

            const {helmet} = helmetContext;

            res.setHeader('Content-Type', 'text/html; charset=utf-8');
            res.status(200)
            res.write(`
                ${openHead}
                ${parseHelmetTemplate(helmet)`
                {title}{meta}
                <link rel="canonical" href="${req.protocol}://${req.hostname}${req.originalUrl}" />
                `}
                ${linkTags}
                ${styleTags}
                ${closeHead}
            `.trim())
            stream
                .pipe(
                    through(
                        function write(data) {
                            this.queue(data)
                        },
                        function end() {
                            this.queue(scriptTags)
                            this.queue(
                                `<script>
                                    window.__PRELOADED_STATE__ = ${serialize(store.getState()).replace(
                                    /</g,
                                    '\\u003c'
                                )}
                                    window.__PRELOADED_FORM_STATE__ = ${formData && JSON.stringify(formData).replace(
                                    /</g,
                                    '\\u003c')}
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
