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
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";
import helmet from "helmet";

import key from "./ssl/private.key";
import cert from "./ssl/private.crt";
import "abort-controller/polyfill";

import ssr from "./lib/ssr";
import api from "./lib/api";
import {authMiddleware, Auth, abilitiesMiddleware} from "./AuthMiddleware";
import {Ability, AbilityBuilder} from "@casl/ability";

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

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

app.use(cors({
    origin: "https://127.0.0.1:1234",
    credentials: true
}));

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
app.use(cookieParser());

const privateKEY = "-----BEGIN RSA PRIVATE KEY-----\n" +
  "MIIBOwIBAAJBAKfn49olVVaLDRd0dPpi50Wpz99QBiJ3yiIRJTFH06kBhU6qVTS0\n" +
  "uiTZapd/e3KVsIlv3Tm1xkaPryD+DohpIaECAwEAAQJBAJ8VuO7hXH/I87h7YLIz\n" +
  "r0hz4j6FRaq2sM+iSwjsMwD2pOsdGIMHXESkn022jdPQ327/8Y/LMlk8qCbNhicd\n" +
  "MxkCIQDULuS4AgJmOfv2VWxFC2Qs+QYjuHDzop5aN+1ZW/j7awIhAMqUQ+NeBPFo\n" +
  "XfpatIOc72M5vPpO093DCnM/gT09PsYjAiEAvlROH+zVgCN1K1MW6pw8QMckRbh1\n" +
  "wWXWy7CtPGHu5n8CIGK0/aNCw4vRO8FqAv0CMc6aao9Ya3lpuKTRM6rgNb8bAiAC\n" +
  "N934USE6rkXup41F7Oo0OCRIAf73yXMED1FR9vkBoQ==\n" +
  "-----END RSA PRIVATE KEY-----";
const publicKEY = "-----BEGIN RSA PUBLIC KEY-----\n" +
  "MEgCQQCn5+PaJVVWiw0XdHT6YudFqc/fUAYid8oiESUxR9OpAYVOqlU0tLok2WqX\n" +
  "f3tylbCJb905tcZGj68g/g6IaSGhAgMBAAE=\n" +
  "-----END RSA PUBLIC KEY-----\n";

const identificationTokenExpirySeconds = 60 * 20;
const authenticationTokenExpirySeconds = 60 * 10;

const auth = Auth({
    privateKEY,
    publicKEY,
    identificationTokenExpirySeconds,
    authenticationTokenExpirySeconds
});

app.use("/api/*", authMiddleware(auth), abilitiesMiddleware((user) => {
    const { can, rules } = new AbilityBuilder();

    can("POST", "/api/login/");

    if (user?.authenticated) {
        can("GET", "/api/list/");
    }

    // can("read", "BlogPost");
    // can manage (i.e., do anything) own posts
    // can('manage', 'BlogPost', { author: user.id });
    // // cannot delete a post if it was created more than a day ago
    // cannot('delete', 'BlogPost', {
    //     createdAt: { $lt: Date.now() - 24 * 60 * 60 * 1000 }
    // });

    return new Ability(rules);
}));

app.use(bodyParser.urlencoded({extended: false}));

app.use(shrinkRay({}));

api(app);

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
