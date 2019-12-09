import path from "path";
import manageTranslations from "react-intl-translations-manager";

import metadata from "app/webpack/metadata";

const {availableLocales, target, i18nTargetPath} = metadata();

manageTranslations({
    messagesDirectory: path.resolve(target, i18nTargetPath),
    translationsDirectory: "app/translations/locales/",
    languages: availableLocales//.filter(locale => locale !== "en"),
    // overridePrinters: {
    //     printDuplicateIds: duplicateIds => {
    //         console.log(`You have ${duplicateIds.length} duplicate IDs`);
    //     },
    //     printLanguageReport: report => {
    //         console.log('Log report for a language');
    //     },
    //     printNoLanguageFile: lang => {
    //         console.log(
    //             `No existing ${lang} translation file found. A new one is created.`
    //         );
    //     },
    //     printNoLanguageWhitelistFile: lang => {
    //         console.log(`No existing ${lang} file found. A new one is created.`);
    //     }
    // },
    // overrideCoreMethods: {
    //     reportLanguage: function(data) {
    //         console.log("***", data)
    //     }
    // }
});
