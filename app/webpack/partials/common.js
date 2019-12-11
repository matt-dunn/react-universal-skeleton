const webpack = require("webpack");
const path = require("path");

// const HardSourceWebpackPlugin = require("hard-source-webpack-plugin");

module.exports = ({environment, root, context, target, targetRelativeClient, targetRelativeServer, publicPath, version, availableLocales}) => ({
    mode: environment,
    cache: true,
    context,
    output: {
        publicPath
    },
    devtool: environment === "development" ? "cheap-module-eval-source-map" : "",
    resolve: {
        extensions: [".js", ".jsx", ".ts", ".tsx", ".scss", ".css"],

        alias: {
            "react-dom": environment === "development" ? "@hot-loader/react-dom" : "react-dom",
            "app": path.join(root, "app"),
            "components": path.join(root, "components"),
            "mocks": path.join(root, "mocks"),
        }
    },
    plugins: (function(){
        const plugins = [
            new webpack.DefinePlugin({
                "process.env.TARGET": JSON.stringify(target),
                "process.env.TARGET_CLIENT": JSON.stringify(targetRelativeClient),
                "process.env.TARGET_SERVER": JSON.stringify(targetRelativeServer),
                "process.env.PWA": JSON.stringify(process.env.PWA || false),
                "process.env.AVAILABLE_LOCALES": JSON.stringify(availableLocales)
            })
        ];

        if (environment === "development") {
            // plugins.push(new webpack.SourceMapDevToolPlugin({
            //     filename: null,
            //     exclude: [/node_modules/],
            //     test: /\.ts($|\?)/i
            // }));
            // plugins.push(new HardSourceWebpackPlugin());
        } else if (environment === "production") {
            plugins.push(new webpack.BannerPlugin({
                banner: `Version: ${version}`,
                raw: false,
                entryOnly: false
            }));
        }

        return plugins;
    })(environment)
});
