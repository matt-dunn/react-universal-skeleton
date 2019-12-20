const {apply} = require("./apply");
const {manage} = require("./manage");

module.exports.translations = ({messagesPath, translationsPath, reportsPath, languages, version}) => {
    return {
        apply: apply({messagesPath, translationsPath, languages}),
        manage: manage({messagesPath, translationsPath, reportsPath, languages, version})
    };
};
