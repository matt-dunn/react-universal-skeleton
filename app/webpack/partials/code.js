const path = require("path");

// const ReactIntlPlugin = require("react-intl-webpack-plugin");

module.exports = ({root, target,/* i18nTargetPath, */i18nMessagesPath}) => ({
    module :{
        rules: [
            {
                test: /\.(js|jsx|ts|tsx)$/,
                exclude: /node_modules/,
                include: [path.resolve(root, "app"), path.resolve(root, "components"), path.resolve(root, "server")],
                loader: "babel-loader",
                query: {
                    "cacheDirectory": false,
                    // "metadataSubscribers":[ReactIntlPlugin.metadataContextFunctionName],
                    "plugins": [
                        "react-hot-loader/babel",
                        [
                            "react-intl-auto",
                            {
                                "removePrefix": "app/",
                                "filebase": false
                            }
                        ],
                        [
                            "react-intl", {
                                messagesDir: path.resolve(target, i18nMessagesPath),
                                extractSourceLocation: false,
                                removeDefaultMessage: false
                            }
                        ]
                    ]
                }
            }
        ]
    },
    // plugins: [
    //     new ReactIntlPlugin({
    //         filename: path.join("..", i18nTargetPath, "default.json")
    //     })
    // ]
});
