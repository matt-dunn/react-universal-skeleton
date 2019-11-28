import url from "url";
import path from "path";
import express from "express";
import https from "https";
import expressStaticGzip from "express-static-gzip";
import trailingSlash from "express-trailing-slash";
// import log from "llog";
import ssr from "./lib/ssr";
import bodyParser from "body-parser";
import helmet from "helmet";

import key from "./ssl/private.key";
import cert from "./ssl/private.crt";
import ca from "./ssl/private.pem";

const environment = process.env.NODE_ENV || "production";

const publicPath = process.env.PUBLIC_PATH || "/";

const {hostname, pathname, port} = url.parse(publicPath);
const appPort = process.env.SSR_PORT || port || 12345;

const app = express();

if (environment === "production") {
    app.use(helmet());
}

app.use(trailingSlash({slash: true}));

app.use(pathname, expressStaticGzip(path.resolve(process.cwd(), "dist", "client"), {
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

app.get("/*", ssr);
app.post("/*", ssr);

export default https
    .createServer({
        key,
        cert,
        ca
    }, app)
    .listen(appPort, hostname, () => {
        console.log(`SSR app listening on port ${appPort}. Go to https://${hostname}:${appPort}${pathname}`);
    });
