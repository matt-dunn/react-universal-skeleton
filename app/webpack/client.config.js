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

const {log} = console;

const {environment, version, root, target, publicPath, port, host} = require("./metadata");

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

module.exports = {
    entry: "./client.js",
    mode: environment,
    devtool: environment === "development" ? "eval-source-map" : "",
    cache: true,
    output: {
        path: path.resolve(root, target, "client"),

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
            "app": path.join(root, "app"),
            "components": path.join(root, "components"),
            "mocks": path.join(root, "mocks"),
        }
    },
    module :{
        rules: [
            {
                test: /\.(js|jsx|ts|tsx)$/,
                exclude: /node_modules/,
                include: [path.resolve(root, "app"), path.resolve(root, "components"), path.resolve(root, "server")],
                use: [
                    {
                        loader: "babel-loader",
                    },
                ]
            },
            {
                test: /\.(css|scss)$/,
                include: [path.resolve(root, "app"), path.resolve(root, "components"), path.resolve(root, "server")],
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
            new webpack.DefinePlugin({
                "process.env.TARGET": JSON.stringify(target)
            }),
            new BundleAnalyzerPlugin({
                openAnalyzer: false,
                analyzerMode: "static",
                reportFilename: path.resolve(root, "reports", "bundle.html")
            }),
            new LoadablePlugin({
                writeToDisk: true
            }),
            new HtmlWebpackPlugin({
                inject: true,
                template: path.resolve(__dirname, "..", "index.html"),
                chunksSortMode: "none",
                //favicon: path.resolve(__dirname, "../favicon.ico")
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
                banner: `Version: ${version}`,
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
            key: fs.readFileSync(path.resolve(root, "server", "ssl", "private.key")),
            cert: fs.readFileSync(path.resolve(root, "server", "ssl", "private.crt")),
            ca: fs.readFileSync(path.resolve(root, "server", "ssl", "private.pem")),
        },
    }
};
