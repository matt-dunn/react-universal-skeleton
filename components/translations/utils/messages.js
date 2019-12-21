const fs = require("fs");
const path = require("path");
const mkdirp = require("mkdirp");

const {stringifyMessages, hashMessages} = require("./utils");
const {getManifest} = require("./manifest");

const getLangMessageFilename = (translationsPath, lang = "default") => path.join(translationsPath, `${lang}.json`);

const getDefaultMessages = messagesPath => hashMessages(JSON.parse(fs.readFileSync(path.join(process.cwd(), messagesPath, "defaultMessages.json")).toString()));

const getLangMessages = (translationsPath, lang = "default") => {
    const filename = getLangMessageFilename(translationsPath, lang);
    return (fs.existsSync(filename) && JSON.parse(fs.readFileSync(filename).toString())) || {};
};

const saveLangMessages = (translationsPath, messages, lang = "default") => {
    const filename = getLangMessageFilename(translationsPath, lang);
    mkdirp(translationsPath);
    fs.writeFileSync(filename, stringifyMessages(messages));
    return filename;
};

const cleanTranslationsFiles = (translationsPath, languages) => {
    const manifest = getManifest(translationsPath);
    const removeFiles = [];

    manifest.languages && Object.values(manifest.languages).forEach(({lang, files}) => {
        if (languages.indexOf(lang) === -1) {
            files && files.forEach(file => {
                if (fs.existsSync(file)) {
                    fs.unlinkSync(file);
                    removeFiles.push(file);
                }
            });
        }
    });

    return removeFiles;
};

module.exports.getLangMessageFilename = getLangMessageFilename;
module.exports.getDefaultMessages = getDefaultMessages;
module.exports.getLangMessages = getLangMessages;
module.exports.saveLangMessages = saveLangMessages;
module.exports.cleanTranslationsFiles = cleanTranslationsFiles;
