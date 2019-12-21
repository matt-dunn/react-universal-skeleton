import commandLineArgs from "command-line-args";

import {translations} from "components/translations";

import metadata from "app/webpack/metadata";

const optionDefinitions = [
    { name: "gen", type: Boolean},
    { name: "status", type: Boolean}
];

const options = commandLineArgs(optionDefinitions);

const {i18nMessagesPath, i18nLocalePath, reportsPath, version} = metadata();

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
