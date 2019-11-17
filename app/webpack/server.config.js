const webpack = require("webpack");
const nodeExternals = require('webpack-node-externals');

const path = require('path');

const ROOT = path.join(__dirname, "../../");

const environment = process.env.NODE_ENV || "production";

console.log(`Building server.... environment: ${environment}`)

module.exports = {
    entry: '../server/index.js',
    mode: environment,
    target: "node",
    externals: [nodeExternals()],
    devtool: "source-map",
    cache: false,
    output: {
        path: path.resolve(ROOT, "dist/server"),

        filename: "[name].js",

        sourceMapFilename: "[name].map",

        chunkFilename: "[name].js",

        publicPath: "/",

        library: "app",
        libraryTarget: "commonjs2"
    },
    context: path.resolve(__dirname, ".."),
    resolve: {
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
                use: [
                    {
                        loader: "css-loader",
                        options: {
                            onlyLocals: true,
                        }
                    },
                ]
            },
            {
                test: /ssl\/.*$/i,
                include: [path.resolve(ROOT, 'app'), path.resolve(ROOT, 'components'), path.resolve(ROOT, 'server')],
                use: 'raw-loader',
            },
        ]
    },
    plugins: [
        new webpack.BannerPlugin({
            banner: 'require("source-map-support").install();',
            raw: true,
            entryOnly: false
        }),
    ],
    optimization: {
        minimize: environment === "production"
    },
};
