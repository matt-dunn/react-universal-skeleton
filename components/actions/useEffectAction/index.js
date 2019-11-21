module.exports =
    process.browser
        ? require("./useEffectAction.client")
        : require("./useEffectAction.server");
