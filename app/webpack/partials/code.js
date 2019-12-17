const path = require("path");

const ReactIntlPlugin = require("react-intl-webpack-plugin");

// const I18NChunksWebpackPlugin = require("../../../components/translations/chunks");

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
        }),
        // new I18NChunksWebpackPlugin({
        //     // Modules requiring translation
        //     modules: [
        //         {
        //             // Identigying module
        //             rule: /src\/module1\.js$/i,
        //
        //             // Defining langs for it
        //             languagesFiles: {
        //                 'en-US': 'i18n/en.json', // Filename doesen't matter but key does.
        //                 'fr-FR': 'i18n/fr.json'
        //             }
        //         },
        //         // ... you can add other rules or import a ones of package
        //     ],
        //
        //     /**
        //      * Directory for temporary files (i18n chunks)
        //      **/
        //     tmpEntriesPath: path.join(root, "dist", 'webpack-i18n-entries')
        // }),
    ]
});
