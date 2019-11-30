const path = require("path");

const webpack = require("webpack");
const nodeExternals = require("webpack-node-externals");
const HtmlWebpackPlugin = require("html-webpack-plugin");
// const HardSourceWebpackPlugin = require("hard-source-webpack-plugin");

const ROOT = path.join(__dirname, "..", "..");
const TARGET = "dist";

const packageJSON = require(path.resolve(ROOT, "package.json"));

const environment = process.env.NODE_ENV || "production";

console.log(`Building server.... environment: ${environment}`);

const publicPath = process.env.PUBLIC_PATH;

const BUILD = {
    version: packageJSON.version
};

module.exports = {
    entry: "../server/index.js",
    mode: environment,
    target: "node",
    externals: [nodeExternals()],
    devtool: "source-map",
    cache: true,
    output: {
        path: path.resolve(ROOT, TARGET, "server"),

        filename: "server.js",

        sourceMapFilename: "[name].map",

        chunkFilename: "[name].js",

        publicPath: publicPath || "/",

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
                loader: "ignore-loader"
            }
        ]
    },
    plugins: (function(/*environment*/) {
        const plugins = [
            new webpack.DefinePlugin({
                "process.env.TARGET": JSON.stringify(TARGET)
            }),
            new HtmlWebpackPlugin({
                inject: false,
                template: path.resolve(__dirname, "..", "index.html"),
                chunksSortMode: "none",
                //favicon: path.resolve(__dirname, "../favicon.ico")
                build: BUILD
            }),
        ];

        if (environment === "production") {
            plugins.push(new webpack.BannerPlugin({
                banner: `Version: ${BUILD.version}`,
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
};
