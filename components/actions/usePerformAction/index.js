module.exports =
    process.browser
        ? require("./usePerformAction.client")
        : require("./usePerformAction.server");
