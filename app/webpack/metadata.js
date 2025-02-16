const url = require("url");
const path = require("path");

const ROOT = path.join(__dirname, "..", "..");

const packageJSON = require(path.join(ROOT, "package.json"));

const environment = process.env.NODE_ENV || "production";

const {getLanguages} = require("../../components/translations/utils");

// Ensure NODE_ENV defaults to production if not set
process.env.NODE_ENV = environment;

const publicPath = process.env.PUBLIC_PATH;
const target = process.env.TARGET || "dist";
const reports = process.env.REPORTS || "reports";
const i18nLocalePath = path.join(__dirname, "..", "i18n");

const {port, hostname} = (publicPath && url.parse(publicPath)) || {};

const availableLocales = getLanguages(i18nLocalePath);

module.exports = (props) => ({
    context: path.join(__dirname, ".."),
    root: ROOT,
    environment,

    publicPath: publicPath || "/",

    target: path.join(ROOT, target, (props && props.configType) || ""),
    targetRelativeClient: path.join(target, "client"),
    targetRelativeServer: path.join(target, "server"),

    reportsPath: path.join(ROOT, reports),

    i18nMessagesPath: path.join(target, "i18n", "source"),
    i18nLocalePath,

    version: packageJSON.version,
    name: packageJSON.name,
    description: packageJSON.description,
    port,
    hostname,
    availableLocales,
    ...props
});
