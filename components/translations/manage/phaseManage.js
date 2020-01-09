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

const phaseManage = (config, {defaultMessages, report, sourceDefaultMessages}) => {
    const {languages, translationsPath, updatedMessagesCallback, emmit} = config;

    const translationCount = Object.keys(defaultMessages).length;

    const ret = {
        processLanguage: lang => {
            const messages = getLangMessages(translationsPath, lang);
            const whitelist = getLangWhitelist(translationsPath, lang);
            const delta = getDelta(defaultMessages, sourceDefaultMessages, messages, whitelist);

            const untranslatedCount = Object.keys(delta.untranslated).length;
            const wordCount = countWords(convertHashToArray(delta.untranslated));

            report.summary.totalTranslationsCount = translationCount;
            report.summary.totalUntranslatedCount += untranslatedCount;
            report.summary.totalWordCount += wordCount;

            const filename = getRelativePath(getLangMessageFilename(translationsPath, lang));
            const whitelistFilename = getRelativePath(getWhitelistFilename(translationsPath, lang));

            const langReport = {
                lang,
                filename,
                whitelistFilename,
                wordCount,
                untranslated: untranslatedCount,
                added: Object.keys(delta.added).length,
                updated: Object.keys(delta.updated).length,
                removed: Object.keys(delta.removed).length,
                delta
            };

            report.languages.push(langReport);

            const updatedMessages = applyDelta(defaultMessages, messages, delta);

            updatedMessagesCallback && updatedMessagesCallback(lang, updatedMessages, {
                filename,
                whitelistFilename
            });

            const langRet = {
                pipe: (cb) => {
                    cb(
                        {
                            ...config,
                            lang
                        },
                        updatedMessages,
                        langReport
                    );

                    return langRet;
                }
            };

            return langRet;
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

            return phaseComplete(config, {report, defaultMessages});
        }
    };

    return ret;
};

module.exports = phaseManage;
