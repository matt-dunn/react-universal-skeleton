const chalk = require("chalk");
const fs = require("fs");
const path = require("path");

const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CompressionPlugin = require("compression-webpack-plugin");
const BrotliPlugin = require("brotli-webpack-plugin");
const LoadablePlugin = require("@loadable/webpack-plugin");
const RobotstxtPlugin = require("robotstxt-webpack-plugin");
const {GenerateSW} = require("workbox-webpack-plugin");

const merge = require("webpack-merge");

const {log} = console;

const partialCommon = require("./partials/common");
const partialCode = require("./partials/code");
const partialAssets = require("./partials/assets");
const partialManifest = require("./partials/manifest");
const partialStats = require("./partials/stats");
const optimizationStats = require("./partials/optimization");

const metadata = require("./metadata")({configType: "client"});
const {environment, version, context, root, target, publicPath, port, hostname} = metadata;

log(chalk`🔨 Building {white.bold client}...
     Environment: {yellow ${environment}}
     Version: {yellow ${version}}

     Target: {yellow ${target}}
     Public Path: {yellow ${publicPath}}
     Host: {yellow ${hostname}}
     Port: {yellow ${port}}
`);

module.exports = merge(
    partialCommon(metadata),
    partialAssets(metadata),
    partialCode(metadata),
    {
        entry: "./index.js",
        output: {
            path: target,

            filename: environment === "development" ? "client.js" : "[name]-[hash].js",

            sourceMapFilename: environment === "development" ? "[name].map" : "[name]-[hash].map",

            chunkFilename: environment === "development" ? "[name].js" : "[id]-[chunkhash].js",
        },
        module: {
            rules: [
                {
                    test: /\.(css|scss)$/,
                    exclude: /node_modules/,
                    include: [
                        path.join(root, "app"),
                        path.join(root, "components"),
                        path.join(root, "server")
                    ],
                    use: [
                        // {
                        //     loader: "style-loader"
                        // },
                        {
                            loader: MiniCssExtractPlugin.loader,
                            options: {
                                hmr: environment === "development",
                                reloadAll: true,
                            },
                        },
                        {
                            loader: "css-loader",
                            options: {
                                sourceMap: true,
                                importLoaders: 2
                            }
                        },
                        {
                            loader: "postcss-loader"
                        },
                        {
                            loader: "sass-loader",
                            options: {
                                sourceMap: true,
                                implementation: require("node-sass"),
                            },
                        }
                    ]
                },
            ]
        },
        plugins: (function(environment) {
            const plugins = [
                new LoadablePlugin({
                    writeToDisk: true
                }),
                new HtmlWebpackPlugin({
                    inject: true,
                    template: path.join(context, "public", "index.html"),
                    //favicon: path.join(context, "public", "favicon.ico")
                    build: {version}
                }),
                new MiniCssExtractPlugin({
                    filename: environment === "development" ? "[name].css" : "[name]-[hash].css",
                    chunkFilename: environment === "development" ? "[name].css" : "[id]-[hash].css",
                    // ignoreOrder: false, // Enable to remove warnings about conflicting order
                })
            ];

            if (environment === "production") {
                plugins.push(new RobotstxtPlugin({}));

                plugins.push(new CompressionPlugin({
                    filename: "[path].gz[query]",
                    algorithm: "gzip",
                    test: /\.js$|\.css$|\.html$/,
                    threshold: 10240,
                    minRatio: 0.7
                }));

                plugins.push(new BrotliPlugin({
                    asset: "[path].br[query]",
                    test: /\.js$|\.css$|\.html$/,
                    threshold: 10240,
                    minRatio: 0.7
                }));

                plugins.push(new GenerateSW({
                    clientsClaim: false,
                    skipWaiting: false,
                    navigateFallback: "index.html"
                }));
            }

            return plugins;
        })(environment),
        devServer: {
            headers: {
                "Access-Control-Allow-Origin": "*"
            },
            hot: true,
            lazy: false,
            stats: "errors-only",
            port,
            sockPort: port,
            open: false,
            public: `${hostname}:${port}`,
            historyApiFallback: true,
            https: {
                key: fs.readFileSync(path.join(context, "server", "ssl", "private.key")),
                cert: fs.readFileSync(path.join(context, "server", "ssl", "private.crt")),
                ca: fs.readFileSync(path.join(context, "server", "ssl", "private.pem")),
            },
        }
    },
    partialManifest(metadata),
    partialStats(metadata),
    optimizationStats(metadata)
);
