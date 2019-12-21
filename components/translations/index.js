const {apply} = require("./apply");
const {manage} = require("./manage");

module.exports.translations = ({messagesPath, translationsPath, reportsPath, version}) => {
    return {
        apply: apply({messagesPath, translationsPath}),
        manage: manage({messagesPath, translationsPath, reportsPath, version})
    };
};
