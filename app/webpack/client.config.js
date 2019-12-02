const chalk = require("chalk");
const fs = require("fs");
const path = require("path");

const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CompressionPlugin = require("compression-webpack-plugin");
const BrotliPlugin = require("brotli-webpack-plugin");
const LoadablePlugin = require("@loadable/webpack-plugin");
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer").BundleAnalyzerPlugin;
// const HardSourceWebpackPlugin = require("hard-source-webpack-plugin");
const merge = require("webpack-merge");

const {log} = console;

const partialCommon = require("./partials/common");
const partialCode = require("./partials/code");
const partialAssets = require("./partials/assets");

const metadata = require("./metadata");
const {environment, version, context, root, target, publicPath, port, host} = metadata;

log(chalk`🔨 Building {white.bold client}...`);
log(chalk`
  Environment: {yellow ${environment}}
  Version: {yellow ${version}}
  Root: {yellow ${root}}
  Target: {yellow ${target}}
  Public Path: {yellow ${publicPath}}
  Host: {yellow ${host}}
  Port: {yellow ${port}}
`);

module.exports = merge(
    partialCommon(metadata),
    partialAssets(metadata),
    partialCode(metadata),
    {
        entry: "./index.js",
        devtool: environment === "development" ? "eval-source-map" : "",
        output: {
            path: path.resolve(root, target, "client"),

            filename: environment === "development" ? "client.js" : "[name]-[hash].js",

            sourceMapFilename: "[name]-[hash].map",

            chunkFilename: "[id]-[chunkhash].js",
        },
        module: {
            rules: [
                {
                    test: /\.(css|scss)$/,
                    exclude: /node_modules/,
                    include: [
                        path.resolve(root, "app"),
                        path.resolve(root, "components"),
                        path.resolve(root, "server")
                    ],
                    use: [
                        {
                            loader: "style-loader"
                        },
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
                            loader: "sass-loader"
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
                    template: path.resolve(context, "public", "index.html"),
                    chunksSortMode: "none",
                    //favicon: path.resolve(context, "public", "favicon.ico")
                    build: {version}
                }),
                new MiniCssExtractPlugin({
                    filename: "[name]-[hash].css",
                    chunkFilename: "[id]-[hash].css",
                    ignoreOrder: false, // Enable to remove warnings about conflicting order
                })
            ];

            if (environment === "development") {
                plugins.push(new webpack.SourceMapDevToolPlugin({
                    filename: null,
                    exclude: [/node_modules/],
                    test: /\.ts($|\?)/i
                }));
                // plugins.push(new HardSourceWebpackPlugin());
            } else if (environment === "production") {
                plugins.push(new BundleAnalyzerPlugin({
                    openAnalyzer: false,
                    analyzerMode: "static",
                    reportFilename: path.resolve(root, "reports", "bundle.html")
                }));

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
            public: host,
            historyApiFallback: true,
            https: {
                key: fs.readFileSync(path.resolve(root, "server", "ssl", "private.key")),
                cert: fs.readFileSync(path.resolve(root, "server", "ssl", "private.crt")),
                ca: fs.readFileSync(path.resolve(root, "server", "ssl", "private.pem")),
            },
        }
    }
);
