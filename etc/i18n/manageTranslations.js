import {translations} from "components/translations/manage";

import metadata from "app/webpack/metadata";

const {availableLocales, i18nMessagesPath, i18nLocalePath, reportsPath} = metadata();

const managedTranslations = translations({
    messagesPath: i18nMessagesPath,
    translationsPath: i18nLocalePath,
    languages: availableLocales,
    reportsPath
}).manage({
    update: true
});

managedTranslations
    .printSummary()
    .saveReport()
    .updateSummary();
