const {
    getLangMessages,
    getDefaultMessages
} = require("../utils");

const phaseManage = require("./phaseManage");

const phaseBegin = config => {
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

    const sourceDefaultMessages = getLangMessages(translationsPath);

    const ret = {
        processLanguages: () => {
            const done = ret.seal({defaultMessages: getDefaultMessages(translationsPath)});

            languages.forEach(lang => {
                done.processLanguage(lang);
                    // .pipe((config, messages, report) => {
                    //     console.log(config, messages)
                    // })
                    // .pipe((config, messages, report) => {
                    //     console.log(report)
                    // })
            });

            return done.done();
        },
        seal: ({defaultMessages}) => phaseManage(config, {defaultMessages, report, sourceDefaultMessages})
    };

    return ret;
};

module.exports = phaseBegin;
