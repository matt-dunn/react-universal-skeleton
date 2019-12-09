import path from "path";
import fs from "fs";
import stringify from "json-stable-stringify";
import commandLineArgs from "command-line-args";

import metadata from "app/webpack/metadata";

const optionDefinitions = [
    { name: "lang", alias: "l", type: String },
    { name: "src", type: String}
];

const options = commandLineArgs(optionDefinitions);

const {lang, src} = options;

if (!lang) {
    console.error("Missing --lang");
    process.exit(1);
}

if (!src) {
    console.error("Missing --src");
    process.exit(1);
}

const {root} = metadata();
const srcMessages = path.resolve(process.cwd(), src);

if (!fs.existsSync(srcMessages)) {
    console.error(`File '${srcMessages}' cannot be found`);
    process.exit(1);
}

const langTarget = path.resolve(root, "app", "translations", "locales", `${lang}.json`);

const messages = JSON.parse(fs.readFileSync(srcMessages).toString());

const bundle = messages.reduce((messages, message) => {
    messages[message.id] = message.defaultMessage;
    return messages;
}, {});

const targetMessages = stringify(bundle, {
    space: 2,
    trailingNewline: false
});

fs.writeFileSync(langTarget, targetMessages);

console.log(`Successfully updated language '${lang}' at '${langTarget}'`);
