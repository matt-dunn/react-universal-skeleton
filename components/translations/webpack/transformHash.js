const getValue = source => typeof source === "string" && JSON.parse(source) || source;

// const getValue = source => {
//     const value = typeof source === "string" && JSON.parse(source) || source;
//
//     return (value && typeof value === "object" && Object.values(value).reduce((messages, message) => {
//         messages[message.id] = message.defaultMessage;
//         return messages;
//     }, {})) || value;
// };

module.exports = content => {
    const obj = content && JSON.stringify(getValue(content))
        .replace(/\u2028/g, "\\u2028")
        .replace(/\u2029/g, "\\u2029");

    return obj && `module.exports = ${obj}`;
};

