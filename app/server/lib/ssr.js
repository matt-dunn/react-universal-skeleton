import path from "path";
import log from "llog";
import through from "through";

import React from "react";
import { renderToNodeStream } from "react-dom/server";
import { StaticRouter } from "react-router-dom";
import { ChunkExtractor } from "@loadable/server";
import {set} from "lodash";

import {serialize} from "components/state-mutate-with-status";
import {parseFormData} from "components/actions/form";
import {getDataFromTree, AsyncData} from "components/ssr/safePromise";
import {errorLike} from "components/error";
import StylesheetServer from "components/myStyled/server";

import getStore from "app/store";
import Bootstrap from "app/bootstrap";
import App from "app/App";

import {getHTMLFragments, parseHelmetTemplate} from "./client";

const statsFile = path.join(process.cwd(), process.env.TARGET_CLIENT, "loadable-stats.json");

const availableLocales = process.env.AVAILABLE_LOCALES;

export default async (req, res) => {
    try {
        const t1 = Date.now();

        let initialState = {};

        // Auth mocking
        if (req.originalUrl.indexOf("/login") !== -1) {
            process.authenticated = undefined;
        }

        if (process.authenticated) {
            initialState = {
                ...initialState,
                auth: {
                    authenticatedUser: process.authenticated
                }
            };
        }

        const store = getStore(initialState);

        const context = {};
        const helmetContext = {};
        const errorContext = {};
        const postData = req.method === "POST" && Object.keys(req.body).reduce((o, key) => {
            set(o, key, req.body[key]);
            return o;
        }, {});
        const formData = parseFormData(req.method === "POST" && postData);

        console.log("FORMDATA", formData);

        const extractor = new ChunkExtractor({ statsFile });
        const asyncData = new AsyncData();

        const locale = req.acceptsLanguages(...availableLocales) || "default";
        const messages = await import(`app/i18n/${locale}.json`);
        const languagePack = {
            locale: req.acceptsLanguages()[0],
            messagesLocale: locale,
            messages: Object.assign({}, messages, (((typeof window !== "undefined" && window) || (typeof process !== "undefined" && process) || {}).I18N_CHANGED || {}))
        };

        const app = extractor.collectChunks(
            <Bootstrap
                languagePack={languagePack}
                asyncData={asyncData}
                formData={formData}
                error={errorContext}
                store={store}
                helmetContext={helmetContext}
            >
                <StaticRouter
                    location={req.originalUrl}
                    context={context}
                >
                    <App/>
                </StaticRouter>
            </Bootstrap>
        );

        const stylesheetServer = StylesheetServer();

        await getDataFromTree(stylesheetServer.collectStyles(app));

        const stream = stylesheetServer.interleaveWithNodeStream(
            renderToNodeStream(stylesheetServer.collectStyles(app))
        );

        if (context.url) {
            console.log("REDIRECT:", context.url);
            res.redirect(301, context.url);
        } else {
            const scriptTags = extractor.getScriptTags();
            const linkTags = extractor.getLinkTags();
            const styleTags = extractor.getStyleTags();

            const {
                open,
                openApp,
                closeApp,
                close
            } = getHTMLFragments();

            const {helmet} = helmetContext;

            res.setHeader("Content-Type", "text/html; charset=utf-8");
            res.status(200);

            res.write(`${open}
                ${parseHelmetTemplate(helmet)`
                    {title}{meta}
                    <link rel="canonical" href="${req.protocol}://${req.hostname}${req.originalUrl}" />
                `}
                ${linkTags}
                ${styleTags}
                ${openApp}`);

            stream
                .pipe(
                    through(
                        function write(data) {
                            this.queue(data);
                        },
                        function end() {
                            this.queue(closeApp);
                            this.queue(
                                `<script>
                                    window.authenticated = ${process.authenticated ? "true" : "false"};
                                    window.__PRELOADED_STATE__ = ${serialize(store.getState()).replace(
                                    /</g,
                                    "\\u003c")}
                                    window.__PRELOADED_FORM_STATE__ = ${formData && JSON.stringify(formData).replace(
                                    /</g,
                                    "\\u003c")}
                                    window.__PRERENDERED_SSR__ = true;
                                    window.__ERROR_STATE__ = ${JSON.stringify(errorContext && errorContext.error && errorLike(errorContext.error))}
                                    window.__ASYNC_DATA_STATE__ = ${asyncData && JSON.stringify(asyncData.data).replace(
                                    /</g,
                                    "\\u003c")}
                                    window.__LANGUAGE_PACK__ = ${asyncData && JSON.stringify(languagePack).replace(
                                    /</g,
                                    "\\u003c")}
                                </script>`
                            );
                            this.queue(scriptTags);
                            this.queue(close);
                            this.queue(null);
                            console.log("----DONE", Date.now() - t1);
                        }
                    )
                )
                .pipe(res);
        }
    } catch (e) {
        log.error(e);
        res.status(500);
        res.end();
    }
};
