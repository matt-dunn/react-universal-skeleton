const url = require("url");
const path = require("path");

const ROOT = path.join(__dirname, "..", "..");

const packageJSON = require(path.resolve(ROOT, "package.json"));

const environment = process.env.NODE_ENV || "production";

// Ensure NODE_ENV defaults to production if not set
process.env.NODE_ENV = environment;

const publicPath = process.env.PUBLIC_PATH;
const target = process.env.TARGET || "dist";

const {port, host} = (publicPath && url.parse(publicPath)) || {};

const availableLocales = ["en", "en-GB", "de", "fr"];

module.exports = (props) => ({
    context: path.resolve(__dirname, ".."),
    root: ROOT,
    environment,
    publicPath: publicPath || "/",
    target,
    i18nTargetPath: "i18n",
    i18nMessagesPath: path.join("i18n", "source"),
    version: packageJSON.version,
    name: packageJSON.name,
    description: packageJSON.description,
    port,
    host,
    availableLocales,
    ...props
});
