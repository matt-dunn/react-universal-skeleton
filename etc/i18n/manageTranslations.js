import fs from "fs";
import path from "path";
import stringify from "json-stable-stringify";

// import { parse } from "intl-messageformat-parser";
// import chalk from "chalk";
// import {Table} from "console-table-printer";

import metadata from "app/webpack/metadata";

const {availableLocales, i18nMessagesPath, i18nLocalePath} = metadata();
// const reportFilename = path.join(reportsPath, "i18l-untranslated.json");
const defaultMessagesFilename = path.join(process.cwd(), i18nMessagesPath, "defaultMessages.json");

console.log(availableLocales);
console.log(i18nLocalePath);

const getDefaultMessages = () => JSON.parse(fs.readFileSync(defaultMessagesFilename).toString());

const getLangMessages = (lang = "default") => {
    const filename = path.join(i18nLocalePath, `_${lang}.json`);
    return (fs.existsSync(filename) && JSON.parse(fs.readFileSync(filename).toString())) || [];
};

const saveLangMessages = (messages, lang = "default") => {
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

const defaultMessages = getDefaultMessages();
const defaultMessagesHash = hashMessages(defaultMessages);

const getDelta = (messages) => {
    const messagesHash = hashMessages(messages);

    const delta = defaultMessages.reduce((delta, message) => {
        const {id, defaultMessage} = message;

        if (!messagesHash[id]) {
            delta.added[id] = message;
            delta.untranslated[id] = message;
        } else if(messagesHash[id] && messagesHash[id].defaultMessage !== defaultMessage) {
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

console.log(getDelta(getLangMessages()));

saveLangMessages(defaultMessages);
