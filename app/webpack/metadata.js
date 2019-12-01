const url = require("url");
const path = require("path");

const ROOT = path.join(__dirname, "..", "..");

const packageJSON = require(path.resolve(ROOT, "package.json"));

const environment = process.env.NODE_ENV || "production";

const publicPath = process.env.PUBLIC_PATH;

const {port, host} = (publicPath && url.parse(publicPath)) || {};

module.exports = {
    root: ROOT,
    environment,
    publicPath,
    target: "dist",
    version: packageJSON.version,
    name: packageJSON.name,
    port,
    host
};
