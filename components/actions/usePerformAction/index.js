module.exports =
    process.browser || process.env.NODE_ENV === "test"
        ? require("./usePerformAction.client")
        : require("./usePerformAction.server");
