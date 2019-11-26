const path = require("path");

const webpack = require("webpack");
const nodeExternals = require("webpack-node-externals");
// const HardSourceWebpackPlugin = require("hard-source-webpack-plugin");

const ROOT = path.join(__dirname, "../../");

const environment = process.env.NODE_ENV || "production";
const target = process.env.TARGET || "production";

console.log(`Building server.... environment: ${environment}, target: ${target}`);

module.exports = {
    entry: "../server/index.js",
    mode: environment,
    target: "node",
    externals: [nodeExternals()],
    devtool: "source-map",
    cache: true,
    output: {
        path: path.resolve(ROOT, "dist/server"),

        filename: "server.js",

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
                test: /\.(scss|css)$/,
                loader: "ignore-loader"
            },
            {
                test: /ssl\/.*$/i,
                include: [path.resolve(ROOT, "app"), path.resolve(ROOT, "components"), path.resolve(ROOT, "server")],
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
    plugins: (function(environment/*, target */) {
        const plugins = [
            new webpack.BannerPlugin({
                banner: 'require("source-map-support").install();',
                raw: true,
                entryOnly: false
            }),
        ];

        // if (environment === "development") {
        //     plugins.push(new HardSourceWebpackPlugin());
        // }

        return plugins;
    })(environment, target),
    optimization: {
        minimize: environment === "production"
    },
};
