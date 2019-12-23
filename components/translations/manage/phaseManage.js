const {
    applyDelta,
    convertHashToArray,
    countWords,
    getDelta,
    getLangMessageFilename,
    getLangMessages,
    getLangWhitelist,
    getRelativePath,
    getWhitelistFilename,
    saveLangMessages
} = require("../utils");

const phaseComplete = require("./phaseComplete");

const phaseManage = (config, {defaultMessages}) => {
    const {languages, translationsPath, version, updatedMessagesCallback, emmit} = config;

    const report = {
        version,
        updated: false,
        timestamp: undefined,
        summary: {
            sourceLanguages: languages,
            totalLanguagesCount: languages.length,
            totalTranslationsCount: 0,
            totalUntranslatedCount: 0,
            totalWordCount: 0,
        },
        languages: []
    };

    const defaultLangMessages = getLangMessages(translationsPath);
    const translationCount = Object.keys(defaultMessages).length;

    const ret = {
        processLanguage: lang => {
            const messages = getLangMessages(translationsPath, lang);
            const whitelist = getLangWhitelist(translationsPath, lang);
            const delta = getDelta(defaultMessages, defaultLangMessages, messages, whitelist);

            const untranslatedCount = Object.keys(delta.untranslated).length;
            const wordCount = countWords(convertHashToArray(delta.untranslated));

            report.summary.totalTranslationsCount = translationCount;
            report.summary.totalUntranslatedCount += untranslatedCount;
            report.summary.totalWordCount += wordCount;

            const filename = getRelativePath(getLangMessageFilename(translationsPath, lang));
            const whitelistFilename = getRelativePath(getWhitelistFilename(translationsPath, lang));

            report.languages.push({
                lang,
                filename,
                whitelistFilename,
                wordCount,
                untranslated: untranslatedCount,
                added: Object.keys(delta.added).length,
                updated: Object.keys(delta.updated).length,
                removed: Object.keys(delta.removed).length,
                delta
            });

            const updatedMessages = applyDelta(defaultMessages, messages, delta);

            updatedMessagesCallback && updatedMessagesCallback(lang, updatedMessages, {
                filename,
                whitelistFilename
            });

            return updatedMessages;
        },
        done: () => {
            const reportLanguages = Object.values(report.languages).map(({lang}) => lang);

            // Add any missing languages to report
            languages.forEach(lang => {
                if (reportLanguages.indexOf(lang) === -1) {
                    ret.processLanguage(lang, defaultMessages);
                }
            });

            report.timestamp = new Date().toISOString();

            if (emmit) {
                defaultMessages && saveLangMessages(translationsPath, defaultMessages);
            }

            return phaseComplete(config, report);
        }
    };

    return ret;
};

module.exports = phaseManage;
