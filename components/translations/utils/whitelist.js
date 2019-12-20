const fs = require("fs");
const path = require("path");
const mkdirp = require("mkdirp");

const {stringifyMessages} = require("./utils");

const getWhitelistFilename = (translationsPath, lang) => path.join(translationsPath, `${lang}_whitelist.json`);

const getLangWhitelist = (translationsPath, lang) => {
    const filename = getWhitelistFilename(translationsPath, lang);
    return (fs.existsSync(filename) && JSON.parse(fs.readFileSync(filename).toString())) || {
        ids: []
    };
};

const saveWhitelist = (translationsPath, whitelist, lang) => {
    const filename = getWhitelistFilename(translationsPath, lang);
    whitelist.ids.sort();
    mkdirp(translationsPath);
    fs.writeFileSync(filename, stringifyMessages(whitelist));
    return filename;
};

module.exports.getWhitelistFilename = getWhitelistFilename;
module.exports.getLangWhitelist = getLangWhitelist;
module.exports.saveWhitelist = saveWhitelist;
