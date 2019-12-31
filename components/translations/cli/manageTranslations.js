const chalk = require("chalk");
const commandLineArgs = require("command-line-args");

const {translations} = require("../../components/translations");

const {getConfig} = require("../../components/translations/utils");

try {
    const {config: {i18nMessagesPath, i18nLocalePath, reportsPath, version}} = getConfig();

    const optionDefinitions = [
        {name: "gen", type: Boolean},
        {name: "status", type: Boolean}
    ];

    const options = commandLineArgs(optionDefinitions);

    const managedTranslations = translations({
        messagesPath: i18nMessagesPath,
        translationsPath: i18nLocalePath,
        version,
        reportsPath
    })
        .manage({
            emmit: false
        });

    const done = managedTranslations
        .processLanguages()
        .printSummary()
        .saveReport()
        .updateSummary();

    if (options.gen) {
        done.generateTranslations();
    }

    if (options.status) {
        done.checkStatus();
    }
} catch (ex) {
    console.error(chalk.red(ex.message));
    process.exit(1);
}
