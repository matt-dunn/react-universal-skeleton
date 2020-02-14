module.exports =
    process.browser || process.env.NODE_ENV === "test"
        ? require("./useEffectAction.client")
        : require("./useEffectAction.server");
