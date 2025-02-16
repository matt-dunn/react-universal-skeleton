const fs = require("fs");
const path = require("path");
const mkdirp = require("mkdirp");

const {stringifyMessages, hashMessages} = require("./utils");
const {getManifest} = require("./manifest");

const getDefaultMessagesFilename = translationsPath => path.join(translationsPath, ".metadata", "defaultMessages.json");

const getDefaultMessages = translationsPath => {
    const filename = getDefaultMessagesFilename(translationsPath);
    return (fs.existsSync(filename) && hashMessages(JSON.parse(fs.readFileSync(filename).toString()))) || {};
};

const saveDefaultMessages = (translationsPath, messages) => {
    if (!Array.isArray(messages)) {
        throw new Error("Messages are invalid; must be an array of messageFormat objects");
    }

    const filename = getDefaultMessagesFilename(translationsPath);
    mkdirp(path.parse(filename).dir);
    fs.writeFileSync(filename, stringifyMessages(messages));
    return filename;
};

const getLangMessageFilename = (translationsPath, lang = "default") => path.join(translationsPath, `${lang}.json`);

const getLangMessages = (translationsPath, lang = "default") => {
    const filename = getLangMessageFilename(translationsPath, lang);
    return (fs.existsSync(filename) && JSON.parse(fs.readFileSync(filename).toString())) || {};
};

const saveLangMessages = (translationsPath, messages, lang = "default") => {
    const filename = getLangMessageFilename(translationsPath, lang);
    mkdirp(path.parse(filename).dir);
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
module.exports.saveDefaultMessages = saveDefaultMessages;
module.exports.getLangMessages = getLangMessages;
module.exports.saveLangMessages = saveLangMessages;
module.exports.cleanTranslationsFiles = cleanTranslationsFiles;
