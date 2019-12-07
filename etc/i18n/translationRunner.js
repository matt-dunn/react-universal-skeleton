import manageTranslations from "react-intl-translations-manager";

import metadata from "app/webpack/metadata";

const {availableLocales} = metadata();

manageTranslations({
    messagesDirectory: "dist/messages/",
    translationsDirectory: "app/translations/locales/",
    languages: availableLocales
});
