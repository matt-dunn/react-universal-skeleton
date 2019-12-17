function getValue(source) {
    const value = typeof source === "string" && JSON.parse(source);

    if (value && Array.isArray(value) && value[0] && value[0].id && value[0].defaultMessage) {
        return value.reduce((hash, {id, defaultMessage}) => {
            hash[id] = defaultMessage;
            return hash;
        }, {});
    }

    return value;
}

module.exports = function(content) {
    const obj = JSON.stringify(getValue(content))
        .replace(/\u2028/g, "\\u2028")
        .replace(/\u2029/g, "\\u2029");

    return `module.exports = ${obj}`;
};

