const path = require("path");

const ReactIntlPlugin = require("react-intl-webpack-plugin");

module.exports = ({root, target, i18nMessagesPath/*, i18nLocalePath*/}) => ({
    module :{
        rules: [
            {
                test: /\.(js|jsx|ts|tsx)$/,
                exclude: /node_modules/,
                include: [
                    path.join(root, "app"),
                    path.join(root, "components"),
                    path.join(root, "server")
                ],
                loader: "babel-loader",
                query: {
                    "cacheDirectory": false,
                    "metadataSubscribers":[ReactIntlPlugin.metadataContextFunctionName],
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
                                messagesDir: i18nMessagesPath,
                                extractSourceLocation: false,
                                removeDefaultMessage: true
                            }
                        ]
                    ]
                }
            }
        ]
    },
    plugins: [
        new ReactIntlPlugin({
            filename: path.join(path.relative(target, i18nMessagesPath), "defaultMessages.json")
        })
    ]
});
