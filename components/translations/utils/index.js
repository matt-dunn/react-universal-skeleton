import fs from "fs";
import path from "path";
import stringify from "json-stable-stringify";
import { parse } from "intl-messageformat-parser";

import {getManifest} from "./manifest";

export const stringifyMessages = messages => stringify(messages, {
    space: 2,
    trailingNewline: false
});

export const getRelativePath = filename => path.relative(__dirname, filename).replace(/\.\.\//g, "");

export const cleanTranslationsFiles = (translationsPath, languages) => {
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

export const hashMessages = messages => messages.reduce((hash, message) => {
    hash[message.id] = message;
    return hash;
}, {});

const normalize = o => o.map(({type, value, options}) => {
    if (type === 0) {
        return value.replace(/[^a-zA-Z\s]+/ig, "").trim();
    } else if (options) {
        return Object.keys(options).map(key => normalize(options[key].value)).join(" ");
    }
}).filter(w => w && w.trim() !== "").join(" ").split(/\b/).filter(word => word.trim() !== "");

export const countWords = messages => messages.reduce((wordCount, {defaultMessage}) => wordCount + normalize(parse(defaultMessage)).length, 0);

export const formatNumber = num => num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");

export const convertHashToArray = messages => Object.values(messages);
