import fs from 'fs';
import path from 'path'
import express from 'express'
import https from "https";
import expressStaticGzip from "express-static-gzip";
import log from 'llog'
import ssr from './lib/ssr'
import bodyParser from 'body-parser'
import helmet from 'helmet'

const port = process.env.PORT || 1234;
const publicPathProd = "/";

const app = express();

app.use(helmet());

app.use(publicPathProd, expressStaticGzip(path.resolve(process.cwd(), 'dist', 'client'), {
    dotfiles : 'allow',
    enableBrotli: true,
    orderPreference: ['br', 'gz'],
    setHeaders: function (res, path) {
        res.setHeader("Cache-Control", "public, max-age=31536000");
    }
}));

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: false }));

app.get('/*', ssr);
app.post('/*', ssr);

import key from "./ssl/private.key";
import cert from "./ssl/private.crt";
import ca from "./ssl/private.pem";

https
    .createServer({
        key,
        cert,
        ca
    }, app)
    .listen(port, () => {
        log.info(`PRODUCTION app listening on port ${port}. Go to https://localhost:${port}${publicPathProd}`);
    });
