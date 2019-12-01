const path = require("path");

module.exports = ({root}) => ( {
    module :{
        rules: [
            {
                test: /ssl\/.*$/i,
                exclude: /node_modules/,
                include: [path.resolve(root, "app"), path.resolve(root, "components"), path.resolve(root, "server")],
                use: "raw-loader",
            },
            {
                test: /mocks\/content\/.*$/i,
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
