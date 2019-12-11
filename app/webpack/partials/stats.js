const path = require("path");

const { StatsWriterPlugin } = require("webpack-stats-plugin");
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer").BundleAnalyzerPlugin;

module.exports = ({environment, configType, target, reportsPath}) => ({
    plugins: (function(){
        const plugins = [
        ];

        if (environment === "production") {
            plugins.push(new StatsWriterPlugin({
                filename: path.join(path.relative(target, reportsPath), `${configType}-stats.json`),
                stats: {
                    all: true,
                    assets: true
                }
            }));

            plugins.push(new BundleAnalyzerPlugin({
                openAnalyzer: false,
                analyzerMode: "static",
                reportFilename: path.join(reportsPath, `${configType}-bundle.html`)
            }));
        }

        return plugins;
    })(environment)
});
