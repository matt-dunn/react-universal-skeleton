const path = require("path");

module.exports = ({root}) => ( {
    module :{
        rules: [
            {
                test: /ssl\/.*$/i,
                exclude: /node_modules/,
                include: [
                    path.join(root, "app"),
                    path.join(root, "components"),
                    path.join(root, "server")
                ],
                use: "raw-loader",
            },
            {
                test: /mocks\/content\/.*$/i,
                exclude: /node_modules/,
                use: "raw-loader",
            },
            {
                type: "javascript/auto",
                test: /i18n\/.*?\.json$/i,
                exclude: /node_modules/,
                use: "translations/webpack/transformHash",
            },
            {
                test: /readme\.md$/i,
                exclude: /node_modules/,
                use: "raw-loader",
            },
            {
                test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: "file-loader",
                        options: {
                            emitFile: false,
                            name: "[name]-[hash].[ext]",
                            outputPath: "fonts/"
                        }
                    }
                ]
            }
        ]
    },
});
