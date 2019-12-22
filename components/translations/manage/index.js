const chalk = require("chalk");

const {
    getConfig
} = require("../utils");

const phaseBegin = require("./phaseBegin");

module.exports.manage = ({messagesPath, translationsPath, reportsPath, version}) => options => {
    const {updatedMessagesCallback, emmit} = Object.assign({}, {emmit: true, updatedMessagesCallback: undefined}, options);

    if (!messagesPath) {
        console.error(chalk.red("'messagesPath' not supplied"));
        process.exit(1);
    }

    if (!translationsPath) {
        console.error(chalk.red("'translationsPath' not supplied"));
        process.exit(1);
    }

    if (!version) {
        console.error(chalk.red("'version' not supplied"));
        process.exit(1);
    }

    try {
        const config = {
            ...getConfig(),
            messagesPath,
            translationsPath,
            reportsPath,
            version,
            updatedMessagesCallback,
            emmit
        };

        return phaseBegin(config);
    } catch (ex) {
        console.error(chalk.red(ex.message));
        process.exit(1);
    }
};
