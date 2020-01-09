const { struct } = require("superstruct");
const path = require("path");
const fs = require("fs");

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

const ROOT = path.resolve(__dirname, "..", "..");

const getConfig = config => {
    if (typeof config === "object") {
        return config;
    } else {
        try {
            const configOptions = require(path.join(ROOT, config));
            const {i18nMessagesPath, i18nLocalePath, reportsPath, version} = (typeof configOptions === "function" && configOptions()) || configOptions;

            return {
                i18nMessagesPath,
                i18nLocalePath,
                reportsPath,
                version
            };
        } catch (ex) {
            throw new Error(`Error parsing config '${config}' - ${ex.message}`);
        }
    }
};

const getOptions = () => {
    const filename = path.join(ROOT, "i18n.config.json");

    const options = Object.assign({
        config: {},
        languages: []
    }, (fs.existsSync(filename) && JSON.parse(fs.readFileSync(filename).toString())));

    const [error] = ConfigSchema.validate(options);

    if (error) {
        throw new Error(`'${error.path}' must be of type '${error.type}'`);
    }

    const config = getConfig(options.config);

    const [errorConfig] = ConfigOptionsSchema.validate(config);

    if (errorConfig) {
        throw new Error(`'${errorConfig.path}' must be of type '${errorConfig.type}'`);
    }

    return {
        ...options,
        config
    };
};

module.exports.getOptions = getOptions;
