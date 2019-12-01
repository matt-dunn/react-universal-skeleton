const chalk = require("chalk");
const path = require("path");

const webpack = require("webpack");
const nodeExternals = require("webpack-node-externals");
const HtmlWebpackPlugin = require("html-webpack-plugin");
// const HardSourceWebpackPlugin = require("hard-source-webpack-plugin");
const merge = require("webpack-merge");

const {log} = console;

const partialCommon = require("./partials/common");
const partialCode = require("./partials/code");

const metadata = require("./metadata");
const {environment, version, root, target, publicPath} = metadata;

log(chalk`🔨 Building {white.bold server}...`);
log(chalk`
  Environment: {yellow ${environment}}
  Version: {yellow ${version}}
  Root: {yellow ${root}}
  Target: {yellow ${target}}
  Public Path: {yellow ${publicPath}}
`);

module.exports = merge(
    partialCommon(metadata),
    partialCode(metadata),
    {
        entry: "../server/index.js",
        target: "node",
        externals: [nodeExternals()],
        devtool: "source-map",
        output: {
            path: path.resolve(root, target, "server"),

            filename: "server.js",

            sourceMapFilename: "[name].map",

            chunkFilename: "[name].js",

            publicPath: publicPath || "/",

            library: "app",
            libraryTarget: "commonjs2"
        },
        module :{
            rules: [
                {
                    test: /\.(scss|css)$/,
                    loader: "ignore-loader"
                },
                {
                    test: /ssl\/.*$/i,
                    include: [path.resolve(root, "app"), path.resolve(root, "components"), path.resolve(root, "server")],
                    use: "raw-loader",
                },
                {
                    test: /mocks\/content\/.*$/i,
                    use: "raw-loader",
                },
                {
                    test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
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
        plugins: (function(/*environment*/) {
            const plugins = [
                new webpack.DefinePlugin({
                    "process.env.TARGET": JSON.stringify(target)
                }),
                new HtmlWebpackPlugin({
                    inject: false,
                    template: path.resolve(__dirname, "..", "index.html"),
                    chunksSortMode: "none",
                    //favicon: path.resolve(__dirname, "../favicon.ico")
                    build: {version}
                }),
            ];

            if (environment === "production") {
                plugins.push(new webpack.BannerPlugin({
                    banner: `Version: ${version}`,
                    raw: false,
                    entryOnly: false
                }));
            }

            // if (environment === "development") {
            //     plugins.push(new HardSourceWebpackPlugin());
            // }

            return plugins;
        })(environment),
        optimization: {
            minimize: environment === "production"
        }
    }
);
