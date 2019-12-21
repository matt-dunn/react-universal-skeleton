const fs = require("fs");
const path = require("path");
const stringify = require("json-stable-stringify");
const { parse } = require("intl-messageformat-parser");

const getConfig = () => {
    const filename = path.join(__dirname, "..", "..", "..", "i18n.config.json");
    return (fs.existsSync(filename) && JSON.parse(fs.readFileSync(filename).toString())) || {
        languages: []
    };
};

const getRelativePath = filename => path.relative(__dirname, filename).replace(/\.\.\//g, "");

const hashMessages = messages => messages.reduce((hash, message) => {
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

const countWords = messages => messages.reduce((wordCount, {defaultMessage}) => wordCount + normalize(parse(defaultMessage)).length, 0);

const formatNumber = num => num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");

const convertHashToArray = messages => Object.values(messages);

const transformHash = messages => Object.values(messages).reduce((messages, message) => {
    messages[message.id] = message.defaultMessage;
    return messages;
}, {});

const stringifyMessages = messages => stringify(messages, {
    space: 2,
    trailingNewline: false
});

module.exports.getConfig = getConfig;
module.exports.getRelativePath = getRelativePath;
module.exports.hashMessages = hashMessages;
module.exports.countWords = countWords;
module.exports.formatNumber = formatNumber;
module.exports.convertHashToArray = convertHashToArray;
module.exports.transformHash = transformHash;
module.exports.stringifyMessages = stringifyMessages;
