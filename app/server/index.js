import chalk from "chalk";
import url from "url";
import path from "path";
import express from "express";
// import https from "https";
import spdy from "spdy";
import expressStaticGzip from "express-static-gzip";
import shrinkRay from "shrink-ray-current";
import trailingSlash from "express-trailing-slash";
// import log from "llog";
import ssr from "./lib/ssr";
import bodyParser from "body-parser";
import helmet from "helmet";

import key from "./ssl/private.key";
import cert from "./ssl/private.crt";
import "abort-controller/polyfill"

const {log} = console;

const environment = process.env.NODE_ENV || "production";

const publicPath = process.env.PUBLIC_PATH || "/";

const {hostname, pathname, port} = url.parse(publicPath);
const appPort = process.env.PORT || port || 12345;
const appHostname = hostname || "localhost";

const app = express();

if (environment === "production") {
    app.use(helmet());
}

app.use(trailingSlash({slash: true}));

app.use(pathname, expressStaticGzip(path.resolve(process.cwd(), process.env.TARGET_CLIENT), {
    dotfiles: "allow",
    index: false,
    enableBrotli: true,
    orderPreference: ["br", "gz"],
    setHeaders: function (res/*, path*/) {
        res.setHeader("Cache-Control", "public, max-age=31536000");
    }
}));

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({extended: false}));

app.use(shrinkRay({}));

app.get("/*", ssr);
app.post("/*", ssr);

export default spdy
    .createServer({
        key,
        cert
    }, app)
    .listen(appPort, appHostname, err => {
        if (err) {
            log(chalk`Could not start server app on port {yellow ${appPort}} - {red ${JSON.stringify(err)}}`);
        } else {
            log(chalk`🔥 Server app listening on port {yellow ${appPort}}. Go to {yellow https://${appHostname}:${appPort}${pathname}}`);
        }
    });
