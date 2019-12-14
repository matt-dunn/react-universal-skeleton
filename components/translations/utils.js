import fs from "fs";
import path from "path";
import stringify from "json-stable-stringify";
import { parse } from "intl-messageformat-parser";
import mkdirp from "mkdirp";

export const stringifyMessages = messages => stringify(messages, {
    space: 2,
    trailingNewline: false
});

export const getDefaultMessages = messagesPath => JSON.parse(fs.readFileSync(path.join(process.cwd(), messagesPath, "defaultMessages.json")).toString());

export const getLangMessages = (translationsPath, lang = "default") => {
    const filename = path.join(translationsPath, `${lang}.json`);
    return (fs.existsSync(filename) && JSON.parse(fs.readFileSync(filename).toString())) || [];
};

export const getLangWhitelist = (translationsPath, lang) => {
    const filename = path.join(translationsPath, `${lang}_whitelist.json`);
    return (fs.existsSync(filename) && JSON.parse(fs.readFileSync(filename).toString())) || {
        ids: []
    };
};

export const saveLangMessages = (translationsPath, messages, lang = "default") => {
    const filename = path.join(translationsPath, `${lang}.json`);
    mkdirp(translationsPath);
    fs.writeFileSync(filename, stringifyMessages(messages));
};

export const saveWhitelist = (translationsPath, whitelist, lang) => {
    const filename = path.join(translationsPath, `${lang}_whitelist.json`);
    whitelist.ids.sort();
    mkdirp(translationsPath);
    fs.writeFileSync(filename, stringifyMessages(whitelist));
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

export const getDelta = (sourceDefaultMessages, defaultLangMessages, messages, whitelist) => {
    const {ids: whitelistIds} = whitelist;
    const messagesHash = hashMessages(messages);
    const defaultLangMessagesHash = hashMessages(defaultLangMessages);
    const defaultMessagesHash = hashMessages(sourceDefaultMessages);

    const delta = sourceDefaultMessages.reduce((delta, message) => {
        const {id} = message;

        if (!messagesHash[id]) {
            delta.added[id] = message;
            delta.untranslated[id] = message;
        } else if (defaultLangMessagesHash[id] && defaultMessagesHash[id].defaultMessage !== defaultLangMessagesHash[id].defaultMessage) {
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
        } else if (messagesHash[id].defaultMessage === defaultMessagesHash[id].defaultMessage && whitelistIds.indexOf(id) === -1) {
            delta.untranslated[id] = messagesHash[id];
        }

        return delta;
    }, delta);

    return delta;
};

export const applyDelta = (sourceMessages, messages, {added, removed, updated}) => {
    const defaultMessagesHash = hashMessages(sourceMessages);

    return messages
        .map(message => {
            const {id} = message;

            if (removed[id]) {
                return undefined;
            } else if (updated[id]) {
                return {
                    ...defaultMessagesHash[id],
                    defaultMessage: updated[id].defaultMessage
                };
            }

            return {
                ...defaultMessagesHash[id],
                defaultMessage: message.defaultMessage
            };
        })
        .filter(message => message)
        .concat(Object.keys(added).map(key => added[key]));
};

export const applyWhitelistDelta = (whitelist, {removed, updated}) => ({
    ...whitelist,
    ids: whitelist.ids
        .map(id => {
            if (removed[id] || updated[id]) {
                return undefined;
            }

            return id;
        })
        .filter(message => message)
});

