const url = require("url");
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

const ROOT = path.join(__dirname, "..", "..");

const packageJSON = require(path.resolve(ROOT, "package.json"));

const environment = process.env.NODE_ENV || "production";

console.log(`Building client.... environment: ${environment}`);

const BUILD = {
    version: packageJSON.version
};

const publicPath = process.env.PUBLIC_PATH;

const {port, host} = (publicPath && url.parse(publicPath)) || {};

module.exports = {
    entry: "./client.js",
    mode: environment,
    devtool: environment === "development" ? "eval-source-map" : "",
    cache: true,
    output: {
        path: path.resolve(ROOT, "dist", "client"),

        filename: environment === "development" ? "client.js" : "[name]-[hash].js",

        sourceMapFilename: "[name]-[hash].map",

        chunkFilename: "[id]-[chunkhash].js",

        publicPath: publicPath || "/"
    },
    context: path.resolve(__dirname, ".."),
    resolve: {
        extensions: [".js", ".jsx", ".ts", ".tsx", ".scss", ".css"],

        alias: {
            "react-dom": "@hot-loader/react-dom",
            "app": path.join(ROOT, "app"),
            "components": path.join(ROOT, "components"),
            "mocks": path.join(ROOT, "mocks"),
        }
    },
    module :{
        rules: [
            {
                test: /\.(js|jsx|ts|tsx)$/,
                exclude: /node_modules/,
                include: [path.resolve(ROOT, "app"), path.resolve(ROOT, "components"), path.resolve(ROOT, "server")],
                use: [
                    {
                        loader: "babel-loader",
                    },
                ]
            },
            {
                test: /\.(css|scss)$/,
                include: [path.resolve(ROOT, "app"), path.resolve(ROOT, "components"), path.resolve(ROOT, "server")],
                use: (function(environment) {
                    const rules = [
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
                    ];

                    // if (environment === "development") {
                    // } else {
                    // }

                    return rules;
                })(environment)
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
                            name: "[name]-[hash].[ext]",
                            outputPath: "fonts/"
                        }
                    }
                ]
            }
        ]
    },
    plugins: (function(environment) {
        const plugins = [
            new BundleAnalyzerPlugin({
                openAnalyzer: false,
                analyzerMode: "static",
                reportFilename: path.resolve(ROOT, "reports", "bundle.html")
            }),
            new LoadablePlugin({
                writeToDisk: true
            }),
            new HtmlWebpackPlugin({
                inject: true,
                template: path.resolve(__dirname, "..", "index.html"),
                chunksSortMode: "none",
                //favicon: path.resolve(__dirname, "../favicon.ico")
                build: BUILD
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
        }

        if (environment === "production") {
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

            plugins.push(new webpack.BannerPlugin({
                banner: `Version: ${BUILD.version}`,
                raw: false,
                entryOnly: false
            }));
        }

        return plugins;
    })(environment),
    optimization: {
        minimize: environment === "production"
    },
    devServer: {
        headers: {
            "Access-Control-Allow-Origin": "*"
        },
        hot: true,
        lazy: false,
        // writeToDisk: true,
        // contentBase: path.resolve(__dirname, ".."),
        stats: "errors-only",
        // host: DEV_HOST,
        port,
        sockPort: port,
        open: false,
        public: host,
        historyApiFallback: true,
        // watchOptions: {
        //     aggregateTimeout: 300,
        //     poll: 1000
        // },
        // https: DEV_PROTOCOL === "https",
        https: {
            key: fs.readFileSync(path.resolve(ROOT, "server", "ssl", "private.key")),
            cert: fs.readFileSync(path.resolve(ROOT, "server", "ssl", "private.crt")),
            ca: fs.readFileSync(path.resolve(ROOT, "server", "ssl", "private.pem")),
        },
    }
};
