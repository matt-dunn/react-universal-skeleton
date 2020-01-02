const chalk = require("chalk");
const commandLineArgs = require("command-line-args");

const {translations} = require("../index");

const {getConfig} = require("../utils");

try {
    const {config: {i18nMessagesPath, i18nLocalePath, reportsPath}} = getConfig();

    const optionDefinitions = [
        {name: "src", type: String, defaultOption: true},
        {name: "lang", type: String}
    ];

    const options = commandLineArgs(optionDefinitions);

    if (!options.src) {
        console.error(chalk.red("Missing --src"));
        process.exit(1);
    }

    translations({
        messagesPath: i18nMessagesPath,
        translationsPath: i18nLocalePath,
        reportsPath
    })
        .apply(options.src, options.lang)
        .printSummary();
} catch(ex) {
    console.error(chalk.red(ex.message));
    process.exit(1);
}
