const {
    getDefaultMessages
} = require("../utils");

const phaseManage = require("./phaseManage");

const phaseBegin = (config) => {
    const {languages, translationsPath, version} = config;

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

    const sourceDefaultMessages = getDefaultMessages(translationsPath);
    const translationCount = Object.keys(sourceDefaultMessages).length;

    const ret = {
        processLanguages: () => {
            const done = ret.seal({defaultMessages: sourceDefaultMessages});

            languages.forEach(lang => {
                done.processLanguage(lang,);
            });

            return done.done();
        },
        seal: ({defaultMessages}) => phaseManage(config, {defaultMessages, report, sourceDefaultMessages, translationCount})
    };

    return ret;
};

module.exports = phaseBegin;
