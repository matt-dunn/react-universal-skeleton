import manageTranslations from "react-intl-translations-manager";

import metadata from "app/webpack/metadata";

const {availableLocales} = metadata();

manageTranslations({
    messagesDirectory: "dist/messages/",
    translationsDirectory: "app/translations/locales/",
    languages: availableLocales.filter(locale => locale !== "en"),
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
