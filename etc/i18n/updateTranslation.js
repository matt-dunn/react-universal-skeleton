import {translations} from "components/translations";
import chalk from "chalk";
import commandLineArgs from "command-line-args";

import metadata from "app/webpack/metadata";

import languages from "./languages";

const optionDefinitions = [
    { name: "src", type: String, defaultOption: true},
    { name: "lang", type: String}
];

const options = commandLineArgs(optionDefinitions);

if (!options.src) {
    console.error(chalk.red("Missing --src"));
    process.exit(1);
}

const {i18nMessagesPath, i18nLocalePath, reportsPath} = metadata();

const managedTranslations = translations({
    messagesPath: i18nMessagesPath,
    translationsPath: i18nLocalePath,
    languages,
    reportsPath
});

managedTranslations
    .apply(options.src, options.lang)
    .printSummary();
