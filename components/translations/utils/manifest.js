import fs from "fs";
import path from "path";
import mkdirp from "mkdirp";

import {stringifyMessages} from "./index";

export const getManifestFilename = translationsPath => path.join(translationsPath, "manifest.json");

export const getManifest = (translationsPath) => {
    const filename = getManifestFilename(translationsPath);
    return (fs.existsSync(filename) && JSON.parse(fs.readFileSync(filename).toString())) || {
        languages: {}
    };
};

export const saveManifest = (translationsPath, report) => {
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
