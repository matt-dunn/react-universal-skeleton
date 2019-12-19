module.exports = function(content) {
    console.log("^^^^^",content)
    const obj = JSON.stringify(content)
        .replace(/\u2028/g, "\\u2028")
        .replace(/\u2029/g, "\\u2029");

    return `module.exports = ${obj}`;
};

