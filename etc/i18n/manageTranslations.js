import commandLineArgs from "command-line-args";

import {translations} from "components/translations";

import metadata from "app/webpack/metadata";

import languages from "./languages";

const {availableLocales, i18nMessagesPath, i18nLocalePath, reportsPath, version} = metadata();

const optionDefinitions = [
    { name: "gen", type: Boolean},
    { name: "status", type: Boolean}
];

const options = commandLineArgs(optionDefinitions);

const managedTranslations = translations({
    messagesPath: i18nMessagesPath,
    translationsPath: i18nLocalePath,
    languages,
    version,
    reportsPath
})
    .manage({
        emmit: true
    });

managedTranslations
    .printSummary()
    .saveReport()
    .updateSummary();

if (options.gen) {
    managedTranslations.generateTranslations();
}

if (options.status) {
    managedTranslations.checkStatus();
}
