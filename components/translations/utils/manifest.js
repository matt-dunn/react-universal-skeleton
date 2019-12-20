const fs = require("fs");
const path = require("path");
const mkdirp = require("mkdirp");

const {stringifyMessages} = require("./utils");

const getManifestFilename = translationsPath => path.join(translationsPath, "manifest.json");

const getManifest = (translationsPath) => {
    const filename = getManifestFilename(translationsPath);
    return (fs.existsSync(filename) && JSON.parse(fs.readFileSync(filename).toString())) || {
        languages: {}
    };
};

const saveManifest = (translationsPath, report) => {
    const filename = getManifestFilename(translationsPath);
    const {languages} = report;
    const manifest = {
        languages: languages.reduce((languages, {lang, filename, whitelistFilename}) => {
            languages[lang] = {
                lang,
                filename,
                whitelistFilename,
                files: [
                    filename,
                    whitelistFilename,
                ]
            };

            return languages;
        }, {})
    };

    mkdirp(translationsPath);
    fs.writeFileSync(filename, stringifyMessages(manifest));

    return filename;
};

const getLanguages = (translationsPath) => Object.keys(getManifest(translationsPath).languages);

module.exports.getManifest = getManifest;
module.exports.saveManifest = saveManifest;
module.exports.getLanguages = getLanguages;
