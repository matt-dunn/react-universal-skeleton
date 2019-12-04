const url = require("url");
const path = require("path");

const ROOT = path.join(__dirname, "..", "..");

const packageJSON = require(path.resolve(ROOT, "package.json"));

const environment = process.env.NODE_ENV || "production";

// Ensure NODE_ENV defaults to production if not set
process.env.NODE_ENV = environment;

const publicPath = process.env.PUBLIC_PATH;

const {port, host} = (publicPath && url.parse(publicPath)) || {};

module.exports = ({configType}) => ({
    context: path.resolve(__dirname, ".."),
    root: ROOT,
    environment,
    publicPath: publicPath || "/",
    target: "dist",
    version: packageJSON.version,
    name: packageJSON.name,
    description: packageJSON.description,
    port,
    host,
    configType
});
