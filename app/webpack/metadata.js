const {readdirSync} = require("fs");
const url = require("url");
const path = require("path");

const ROOT = path.join(__dirname, "..", "..");

const packageJSON = require(path.resolve(ROOT, "package.json"));

const environment = process.env.NODE_ENV || "production";

// Ensure NODE_ENV defaults to production if not set
process.env.NODE_ENV = environment;

const publicPath = process.env.PUBLIC_PATH;

const {port, host} = (publicPath && url.parse(publicPath)) || {};

const getDirectories = source =>
    readdirSync(source, { withFileTypes: true })
        .filter(dirent => dirent.isDirectory())
        .map(dirent => dirent.name);

const availableLocales = getDirectories("app/locale");

module.exports = (props) => ({
    context: path.resolve(__dirname, ".."),
    root: ROOT,
    environment,
    publicPath: publicPath || "/",
    target: process.env.TARGET || "dist",
    version: packageJSON.version,
    name: packageJSON.name,
    description: packageJSON.description,
    port,
    host,
    availableLocales,
    ...props
});
