function getValue(source) {
    const value = typeof source === "string" && JSON.parse(source);

    return value && Object.values(value).reduce((messages, message) => {
        messages[message.id] = message.defaultMessage;
        return messages;
    }, {});
}

module.exports = function(content) {
    const obj = JSON.stringify(getValue(content))
        .replace(/\u2028/g, "\\u2028")
        .replace(/\u2029/g, "\\u2029");

    return `module.exports = ${obj}`;
};

