const webpack = require("webpack");
const path = require("path");

module.exports = ({environment, root, context, target, publicPath, version}) => ( {
    mode: environment,
    cache: true,
    context,
    output: {
        publicPath
    },
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
                "process.env.TARGET": JSON.stringify(target)
            })
        ];

        if (environment === "production") {
            plugins.push(new webpack.BannerPlugin({
                banner: `Version: ${version}`,
                raw: false,
                entryOnly: false
            }));
        }

        return plugins;
    })(environment)
});
