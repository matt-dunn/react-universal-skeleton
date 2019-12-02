const chalk = require("chalk");
const path = require("path");

const nodeExternals = require("webpack-node-externals");
const HtmlWebpackPlugin = require("html-webpack-plugin");
// const HardSourceWebpackPlugin = require("hard-source-webpack-plugin");
const merge = require("webpack-merge");

const {log} = console;

const partialCommon = require("./partials/common");
const partialCode = require("./partials/code");
const partialAssets = require("./partials/assets");

const metadata = require("./metadata");
const {environment, version, context, root, target, publicPath} = metadata;

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
    partialAssets(metadata),
    partialCode(metadata),
    {
        entry: "./server/index.js",
        target: "node",
        externals: [nodeExternals()],
        output: {
            path: path.resolve(root, target, "server"),

            filename: "server.js",

            sourceMapFilename: "[name].map",

            chunkFilename: "[name].js",

            library: "app",
            libraryTarget: "commonjs2"
        },
        module :{
            rules: [
                {
                    test: /\.(scss|css)$/,
                    exclude: /node_modules/,
                    loader: "ignore-loader"
                },
            ]
        },
        plugins: [
            new HtmlWebpackPlugin({
                inject: false,
                template: path.resolve(context, "public", "index.html"),
                chunksSortMode: "none",
                //favicon: path.resolve(context, "public" "favicon.ico")
                build: {version}
            }),
        ],
    }
);
