const fs = require("fs");
const path = require("path");
const stringify = require("json-stable-stringify");
const { parse } = require("intl-messageformat-parser");
const { struct } =require("superstruct");

const ConfigSchema = struct({
    config: "string|object",
    languages: struct.optional(struct.array(["string"]))
});

const ConfigOptionsSchema = struct({
    i18nMessagesPath: "string",
    i18nLocalePath: "string",
    reportsPath: "string",
    version: "string"
});

const parseConfig = config => {
    if (typeof config === "object") {
        return config;
    } else {
        try {
            const configOptions = require(path.resolve(__dirname, "..", "..", "..", config));
            const {i18nMessagesPath, i18nLocalePath, reportsPath, version} = (typeof configOptions === "function" && configOptions()) || configOptions;

            return {
                i18nMessagesPath,
                i18nLocalePath,
                reportsPath,
                version
            };
        } catch (ex) {
            throw new Error(`Unable to find config '${config}'`);
        }
    }
};

const getConfig = () => {
    const filename = path.join(__dirname, "..", "..", "..", "i18n.config.json");
    const config = Object.assign({
        languages: []
    }, (fs.existsSync(filename) && JSON.parse(fs.readFileSync(filename).toString())));

    const [error] = ConfigSchema.validate(config);

    if (error) {
        throw new Error(`'${error.path}' must be of type '${error.type}'`);
    }

    config.config = parseConfig(config.config);
    const [errorConfig] = ConfigOptionsSchema.validate(config.config);
    if (errorConfig) {
        throw new Error(`'${errorConfig.path}' must be of type '${errorConfig.type}'`);
    }

    return config;
};

const getRelativePath = filename => path.relative(__dirname, filename).replace(/\.\.\//g, "");

const hashMessages = messages => messages.reduce((hash, message) => {
    hash[message.id] = message;
    return hash;
}, {});

const normalize = o => o.map(({type, value, options}) => {
    if (type === 0) {
        return value.replace(/[^a-zA-Z\s]+/ig, "").trim();
    } else if (options) {
        return Object.keys(options).map(key => normalize(options[key].value)).join(" ");
    }
}).filter(w => w && w.trim() !== "").join(" ").split(/\b/).filter(word => word.trim() !== "");

const countWords = messages => messages.reduce((wordCount, defaultMessage) => wordCount + normalize(parse(defaultMessage)).length, 0);

const formatNumber = num => num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");

const convertHashToArray = messages => Object.values(messages);

const transformHash = messages => Object.values(messages).reduce((messages, message) => {
    messages[message.id] = message.defaultMessage;
    return messages;
}, {});

const stringifyMessages = messages => stringify(messages, {
    space: 2,
    trailingNewline: false
});

module.exports.getConfig = getConfig;
module.exports.getRelativePath = getRelativePath;
module.exports.hashMessages = hashMessages;
module.exports.countWords = countWords;
module.exports.formatNumber = formatNumber;
module.exports.convertHashToArray = convertHashToArray;
module.exports.transformHash = transformHash;
module.exports.stringifyMessages = stringifyMessages;
