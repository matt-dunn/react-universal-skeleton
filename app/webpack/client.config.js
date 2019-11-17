const fs = require('fs');

const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CompressionPlugin = require('compression-webpack-plugin');
const BrotliPlugin = require('brotli-webpack-plugin');
const LoadablePlugin = require('@loadable/webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const path = require('path');

const ROOT = path.join(__dirname, "../../");

const BUILD = {
    version: "DEV",
    number: "0.0.0"
};

const DEV_PROTOCOL = "https";
const DEV_PORT = 1234;
const DEV_HOST = "0.0.0.0";
const DEV_DOMAIN = DEV_HOST + ":" + DEV_PORT;

const environment = process.env.NODE_ENV || "production";
const optimise = process.env.OPTIMISE !== 'false';

console.log(`Building client.... environment: ${environment}, optimise: ${optimise}`)

module.exports = {
    entry: './client.js',
    mode: environment,
    devtool: environment === "development" ? "eval-source-map" : "",
    cache: false,
    output: {
        path: path.resolve(ROOT, "dist/client"),

        filename: "[name]-[hash].js",

        sourceMapFilename: "[name]-[hash].map",

        chunkFilename: "[id]-[chunkhash].js",

        publicPath: "/"
    },
    context: path.resolve(__dirname, ".."),
    resolve: {
        extensions: [".js", ".jsx", ".ts", ".tsx", ".scss", ".css"],

        alias: {
            // 'react-dom': '@hot-loader/react-dom',
            "app": path.join(ROOT, "app"),
            "components": path.join(ROOT, "components"),
        }
    },
    module :{
        rules: [
            {
                test: /\.(js|jsx|ts|tsx)$/,
                exclude: /node_modules/,
                include: [path.resolve(ROOT, 'app'), path.resolve(ROOT, 'components'), path.resolve(ROOT, 'server')],
                use: [
                    {
                        loader: "babel-loader",
                    },
                ]
            },
            {
                test: /\.css$/,
                include: [path.resolve(ROOT, 'app'), path.resolve(ROOT, 'components'), path.resolve(ROOT, 'server')],
                use: (function(environment) {
                    const rules = [];

                    if (environment === "development") {
                        rules.push({
                            loader: "style-loader"
                        });
                    } else {
                        rules.push({
                            loader: MiniCssExtractPlugin.loader,
                            options: {
                                hmr: environment === 'development',
                                reloadAll: true,
                            },
                        });
                    }

                    rules.push({
                        loader: "css-loader",
                        options: {
                            sourceMap: true,
                            importLoaders: 2
                        }
                    });

                    return rules;
                })(environment)
            },
        ]
    },
    plugins: (function(environment, optimise) {
        const plugins = [
            new webpack.optimize.ModuleConcatenationPlugin(),
            new BundleAnalyzerPlugin({
                openAnalyzer: false,
                analyzerMode: 'static',
                reportFilename: path.resolve(ROOT, "reports", "bundle.html")
            }),
            new webpack.SourceMapDevToolPlugin({
                filename: null,
                exclude: [/node_modules/],
                test: /\.ts($|\?)/i
            }),
            new LoadablePlugin(),
            new HtmlWebpackPlugin({
                inject: environment !== "production",
                template: path.resolve(__dirname, "../index.html"),
                chunksSortMode: "none",
                //favicon: path.resolve(__dirname, "../favicon.ico")
                build: BUILD
            })
        ];

        if (environment === "production") {
            plugins.push(new MiniCssExtractPlugin({
                filename: '[name]-[hash].css',
                chunkFilename: '[id]-[hash].css',
                ignoreOrder: false, // Enable to remove warnings about conflicting order
            }));
        }

        if (environment === "production" && optimise) {
            plugins.push(new CompressionPlugin({
                filename: '[path].gz[query]',
                algorithm: 'gzip',
                test: /\.js$|\.css$|\.html$/,
                threshold: 10240,
                minRatio: 0.7
            }));

            plugins.push(new BrotliPlugin({
                asset: '[path].br[query]',
                test: /\.js$|\.css$|\.html$/,
                threshold: 10240,
                minRatio: 0.7
            }))
        }

        return plugins;
    })(environment, optimise),
    optimization: {
        minimize: environment === "production"
    },
    devServer: {
        headers: {
            "Access-Control-Allow-Origin": DEV_PROTOCOL + "://" + DEV_DOMAIN
        },
        hot: true,
        contentBase: path.resolve(__dirname, ".."),
        stats: "errors-only",
        host: DEV_HOST,
        port: DEV_PORT,
        open: false,
        public: "0.0.0.0" + ":" + DEV_PORT,
        historyApiFallback: true,
        watchOptions: {
            aggregateTimeout: 300,
            poll: 1000
        },
        // https: DEV_PROTOCOL === "https",
        https: {
            key: fs.readFileSync(path.resolve(ROOT, "server/ssl/private.key")),
            cert: fs.readFileSync(path.resolve(ROOT, "server/ssl/private.crt")),
            ca: fs.readFileSync(path.resolve(ROOT, "server/ssl/private.pem")),
        },
    }
};
