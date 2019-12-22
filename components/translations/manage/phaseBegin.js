const {
    getDefaultMessages
} = require("../utils");

const phaseManage = require("./phaseManage");

const phaseBegin = (config) => {
    const {languages, messagesPath} = config;

    const ret = {
        processLanguages: () => {
            // const done = ret.seal({defaultMessages: getLangMessages(translationsPath)});
            const done = ret.seal({defaultMessages: getDefaultMessages(messagesPath)});

            languages.forEach(lang => {
                done.processLanguage(lang,);
            });

            return done.done();
        },
        seal: ({defaultMessages}) => {
            return phaseManage(config, {defaultMessages});
        }
    };

    return ret;
};

module.exports = phaseBegin;
