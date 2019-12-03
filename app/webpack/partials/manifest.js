const path = require("path");

const FaviconsWebpackPlugin = require("favicons-webpack-plugin");

module.exports = ({environment, name, description, context}) => ({
    plugins: (function(){
        const plugins = [
        ];

        if (environment === "production") {
            plugins.push(new FaviconsWebpackPlugin({
                logo: path.resolve(context, "assets", "favicon.png"),
                inject: "force",
                favicons: {
                    appName: name,
                    appDescription: description,
                    background: "#fff",
                    theme_color: '#333',
                    icons: {
                        android: true,
                        appleIcon: true,
                        appleStartup: true,
                        coast: false,
                        favicons: true,
                        firefox: true,
                        opengraph: false,
                        twitter: false,
                        yandex: false,
                        windows: false
                    }
                }
            }));
        }

        return plugins;
    })(environment)
});
