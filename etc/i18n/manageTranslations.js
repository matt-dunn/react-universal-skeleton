import {translations} from "components/translations";

import metadata from "app/webpack/metadata";

const {availableLocales, i18nMessagesPath, i18nLocalePath, reportsPath} = metadata();

const managedTranslations = translations({
    messagesPath: i18nMessagesPath,
    translationsPath: i18nLocalePath,
    languages: availableLocales,
    reportsPath
});

managedTranslations
    .manage({
        update: true
    })
    .printSummary()
    .saveReport()
    .updateSummary();
