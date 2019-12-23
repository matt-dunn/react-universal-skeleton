const {
    getDefaultMessages
} = require("../utils");

const phaseManage = require("./phaseManage");

const phaseBegin = (config) => {
    const {languages, translationsPath} = config;

    const ret = {
        processLanguages: () => {
            const done = ret.seal({defaultMessages: getDefaultMessages(translationsPath)});

            languages.forEach(lang => {
                done.processLanguage(lang,);
            });

            return done.done();
        },
        seal: ({defaultMessages}) => phaseManage(config, {defaultMessages})
    };

    return ret;
};

module.exports = phaseBegin;
