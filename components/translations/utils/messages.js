import fs from "fs";
import path from "path";
import mkdirp from "mkdirp";

import {hashMessages, stringifyMessages} from "./index";

export const getLangMessageFilename = (translationsPath, lang = "default") => path.join(translationsPath, `${lang}.json`);

export const getDefaultMessages = messagesPath => hashMessages(JSON.parse(fs.readFileSync(path.join(process.cwd(), messagesPath, "defaultMessages.json")).toString()));

export const getLangMessages = (translationsPath, lang = "default") => {
    const filename = getLangMessageFilename(translationsPath, lang);
    return (fs.existsSync(filename) && JSON.parse(fs.readFileSync(filename).toString())) || [];
};

export const saveLangMessages = (translationsPath, messages, lang = "default") => {
    const filename = getLangMessageFilename(translationsPath, lang);
    mkdirp(translationsPath);
    fs.writeFileSync(filename, stringifyMessages(messages));
    return filename;
};
