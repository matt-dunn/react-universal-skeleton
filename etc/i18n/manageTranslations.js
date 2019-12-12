import fs from "fs";
import path from "path";
import stringify from "json-stable-stringify";
import { parse } from "intl-messageformat-parser";
import chalk from "chalk";
import {Table} from "console-table-printer";

import metadata from "app/webpack/metadata";

const {availableLocales, i18nMessagesPath, i18nLocalePath} = metadata();
// const reportFilename = path.join(reportsPath, "i18l-untranslated.json");

const getDefaultMessages = () => JSON.parse(fs.readFileSync(path.join(process.cwd(), i18nMessagesPath, "defaultMessages.json")).toString());

const getLangMessages = (lang = "default") => {
    if (lang !== "default" && availableLocales.indexOf(lang) === -1) {
        throw new Error(`Language '${lang} is not defined. Available: [${availableLocales}]`);
    }

    const filename = path.join(i18nLocalePath, `_${lang}.json`);
    return (fs.existsSync(filename) && JSON.parse(fs.readFileSync(filename).toString())) || [];
};

const saveLangMessages = (messages, lang = "default") => {
    if (lang !== "default" && availableLocales.indexOf(lang) === -1) {
        throw new Error(`Language '${lang} is not defined. Available: [${availableLocales}]`);
    }

    const filename = path.join(i18nLocalePath, `_${lang}.json`);
    fs.writeFileSync(filename, stringify(messages, {
        space: 2,
        trailingNewline: false
    }));
};

const hashMessages = messages => messages.reduce((hash, message) => {
    hash[message.id] = message;
    return hash;
}, {});

const normalize = o => {
    return o.map(({type, value, options}) => {
        if (type === 0) {
            return value.replace(/[^a-zA-Z\s]+/ig, "").trim();
        } else if (options) {
            return Object.keys(options).map(key => normalize(options[key].value)).join(" ");
        }
    }).filter(w => w && w.trim() !== "").join(" ").split(/\b/).filter(word => word.trim() !== "");
};

const countWords = messages => messages.reduce((wordCount, {defaultMessage}) => wordCount + normalize(parse(defaultMessage)).length, 0);

const formatNumber = num => num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");

const convertHashToArray = messages => Object.values(messages);

const defaultLangMessages = getLangMessages();
const defaultLangMessagesHash = hashMessages(defaultLangMessages);
const defaultMessages = getDefaultMessages();
const defaultMessagesHash = hashMessages(defaultMessages);

const translationCount = defaultLangMessages.length;

const getDelta = (messages) => {
    const messagesHash = hashMessages(messages);

    const delta = defaultMessages.reduce((delta, message) => {
        const {id} = message;

        if (!messagesHash[id]) {
            delta.added[id] = message;
            delta.untranslated[id] = message;
        } else if (defaultMessagesHash[id].defaultMessage !== defaultLangMessagesHash[id].defaultMessage) {
            delta.updated[id] = message;
            delta.untranslated[id] = message;
        } else if (messagesHash[id] && !defaultMessagesHash[id]) {
            delta.removed[id] = message;
        }

        return delta;
    }, {
        added: {},
        removed: {},
        updated: {},
        untranslated: {}
    });

    Object.keys(messagesHash).reduce((delta, id) => {
        if (!defaultMessagesHash[id]) {
            delta.removed[id] = messagesHash[id];
        } else if (messagesHash[id].defaultMessage === defaultMessagesHash[id].defaultMessage) {
            delta.untranslated[id] = messagesHash[id];
        }

        return delta;
    }, delta);

    return delta;
};

const applyDelta = (lang, messages, {added, removed, updated}) => {
    return messages
        .map(message => {
            const {id} = message;
            if (removed[id]) {
                return undefined;
            } else if (updated[id]) {
                return updated[id];
            } else {
                return message;
            }
        })
        .filter(message => message)
        .concat(Object.keys(added).map(key => added[key]));
};

try {
    const t = new Table({
        columns: [
            { name: "Language", alignment: "left" }, //with alignment
            { name: "Translations", alignment: "right" },
            { name: "Outstanding", alignment: "right" },
            { name: "% Complete", alignment: "right" },
            { name: "≈ Outstanding Words", alignment: "right" },
        ],
    });

    availableLocales.forEach(lang => {
        const messages = getLangMessages(lang);
        const delta = getDelta(messages);
        const updatedMessages = applyDelta(lang, messages, delta);

        // console.log(lang, delta);

        saveLangMessages(updatedMessages, lang);

        const untranslatedCount = Object.keys(delta.untranslated).length;
        const wordCount = countWords(convertHashToArray(delta.untranslated));

        t.addRow({
            "Language": lang,
            "Translations": formatNumber(translationCount),
            "Outstanding": formatNumber(untranslatedCount),
            "% Complete": `${Math.round((100 - ((untranslatedCount / translationCount) * 100)) * 100) / 100}%`,
            "≈ Outstanding Words": formatNumber(wordCount)
        }, {color: untranslatedCount === 0 ? "green" : "yellow"});
    });

    saveLangMessages(defaultMessages);

    t.printTable();
} catch (ex) {
    console.error(chalk.red(ex.message));
    process.exit(1);
}
