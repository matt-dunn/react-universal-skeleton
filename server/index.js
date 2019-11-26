import path from "path";
import express from "express";
import https from "https";
import expressStaticGzip from "express-static-gzip";
import trailingSlash from "express-trailing-slash";
import log from "llog";
import ssr from "./lib/ssr";
import bodyParser from "body-parser";
// import helmet from "helmet";

import key from "./ssl/private.key";
import cert from "./ssl/private.crt";
import ca from "./ssl/private.pem";
import url from "url";

const app = express();

// app.use(helmet());

export const createServer = publicPath => {
    console.log(">>>>>",publicPath)
    const {hostname, pathname, port = process.env.SERVER_PORT || 12345} = url.parse(publicPath);

    app.use(trailingSlash({slash: true}));

    app.use(pathname, expressStaticGzip(path.resolve(process.cwd(), "dist", "client"), {
        dotfiles: "allow",
        index: false,
        enableBrotli: true,
        orderPreference: ["br", "gz"],
        setHeaders: function (res/*, path*/) {
            // res.setHeader("Cache-Control", "public, max-age=31536000");
            res.setHeader("Cache-Control", "no-cache");
        }
    }));

    app.use(bodyParser.json());

    app.use(bodyParser.urlencoded({extended: false}));

    app.get("/*", ssr);
    app.post("/*", ssr);

    return https
        .createServer({
            key,
            cert,
            ca
        }, app)
        .listen(port, hostname, () => {
            log.info(`PRODUCTION app listening on port ${port}. Go to https://${hostname}:${port}${pathname}`);
        });
};
