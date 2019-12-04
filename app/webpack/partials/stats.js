const path = require("path");

const { StatsWriterPlugin } = require("webpack-stats-plugin");
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer").BundleAnalyzerPlugin;

module.exports = ({environment, root, configType}) => ({
    plugins: (function(){
        const plugins = [
        ];

        if (environment === "production") {
            plugins.push(new StatsWriterPlugin({
                filename: path.join("..", "..", "reports", `${configType}-stats.json`),
                stats: {
                    all: true,
                    assets: true
                }
            }));

            plugins.push(new BundleAnalyzerPlugin({
                openAnalyzer: false,
                analyzerMode: "static",
                reportFilename: path.resolve(root, "reports", `${configType}-bundle.html`)
            }));
        }

        return plugins;
    })(environment)
});
