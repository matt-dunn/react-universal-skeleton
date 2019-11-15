const fs = require('fs');

const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CompressionPlugin = require('compression-webpack-plugin');
const BrotliPlugin = require('brotli-webpack-plugin');

const path = require('path');

const ROOT = path.join(__dirname, "../../");

const BUILD = {
    version: "DEV",
    number: "0.0.0"
};

const DEV_PROTOCOL = "https";
const DEV_PORT = 1234;
const DEV_HOST = "0.0.0.0";//"local.training.co.uk";
const DEV_DOMAIN = DEV_HOST + ":" + DEV_PORT;

const ENV = process.env.NODE_ENV || "production";

console.log("Building client....", ENV)

module.exports = {
    entry: './client.js',
    mode: ENV,
    devtool: "source-map",
    output: {
        path: path.resolve(ROOT, "dist/client"),

        filename: "[name]-[hash].js",

        sourceMapFilename: "[name]-[hash].map",

        chunkFilename: "[id]-[chunkhash].js",

        publicPath: "/"
    },
    context: path.resolve(__dirname, ".."),
    resolve: {
        modules: [
            path.join(__dirname, "../../"),
            path.join(ROOT, "node_modules")
        ],

        extensions: [".js", ".jsx", ".ts", ".tsx", ".scss", ".css"],

        alias: {
            'react-dom': '@hot-loader/react-dom',
            "app": path.join(ROOT, "app"),
            "components": path.join(ROOT, "components"),
        }
    },
    module :{
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/
            },
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader"
                }
            },
            {
                test: /\.css$/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            hmr: process.env.NODE_ENV === 'development',
                        },
                    },
                    // {
                    //     loader: "style-loader"
                    // },
                    {
                        loader: "css-loader",
                        options: {
                            sourceMap: true,
                            importLoaders: 2
                        }
                    },
                ]
            },
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            inject: true,
            template: path.resolve(__dirname, "../index.html"),
            chunksSortMode: "none",
            //favicon: path.resolve(__dirname, "../favicon.ico")
            build: BUILD
        }),
        new MiniCssExtractPlugin({
            filename: '[name]-[hash].css',
            chunkFilename: '[id]-[hash].css',
            ignoreOrder: false, // Enable to remove warnings about conflicting order
        }),
        new CompressionPlugin({
            filename: '[path].gz[query]',
            algorithm: 'gzip',
            test: /\.js$|\.css$|\.html$/,
            threshold: 10240,
            minRatio: 0.7
        }),
        new BrotliPlugin({
            asset: '[path].br[query]',
            test: /\.js$|\.css$|\.html$/,
            threshold: 10240,
            minRatio: 0.7
        }),
    ],
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
