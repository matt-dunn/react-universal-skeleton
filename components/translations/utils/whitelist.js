import fs from "fs";
import path from "path";
import mkdirp from "mkdirp";

import {stringifyMessages} from "./index";

export const getWhitelistFilename = (translationsPath, lang) => path.join(translationsPath, `${lang}_whitelist.json`);

export const getLangWhitelist = (translationsPath, lang) => {
    const filename = getWhitelistFilename(translationsPath, lang);
    return (fs.existsSync(filename) && JSON.parse(fs.readFileSync(filename).toString())) || {
        ids: []
    };
};

export const saveWhitelist = (translationsPath, whitelist, lang) => {
    const filename = getWhitelistFilename(translationsPath, lang);
    whitelist.ids.sort();
    mkdirp(translationsPath);
    fs.writeFileSync(filename, stringifyMessages(whitelist));
    return filename;
};

