const webpack = require("webpack");
const path = require("path");

module.exports = ({environment, root, context, target, publicPath}) => ( {
    mode: environment,
    cache: true,
    context,
    output: {
        publicPath
    },
    resolve: {
        extensions: [".js", ".jsx", ".ts", ".tsx", ".scss", ".css"],

        alias: {
            "react-dom": "@hot-loader/react-dom",
            "app": path.join(root, "app"),
            "components": path.join(root, "components"),
            "mocks": path.join(root, "mocks"),
        }
    },
    plugins: [
        new webpack.DefinePlugin({
            "process.env.TARGET": JSON.stringify(target)
        })
    ],
    optimization: {
        minimize: environment === "production"
    }
});
