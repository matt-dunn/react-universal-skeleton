const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const nodeExternals = require('webpack-node-externals');

const path = require('path');

const ROOT = path.join(__dirname, "../../");

const BUILD = {
    version: "DEV",
    number: "0.0.0"
};

const DEV_PROTOCOL = "http";
const DEV_PORT = 3020;
const DEV_HOST = "0.0.0.0";//"local.training.co.uk";
const DEV_DOMAIN = DEV_HOST + ":" + DEV_PORT;

const ENV = process.env.NODE_ENV || "production";

console.log("ENV", ENV)

module.exports = {
    entry: '../server/index.js',
    mode: ENV,
    target: "node",
    externals: [nodeExternals()],
    devtool: "source-map",
    output: {
        path: path.resolve(ROOT, "dist/server"),

        filename: "main.js",

        sourceMapFilename: "[name].map",

        chunkFilename: "[id]-chunk.js",

        publicPath: "/",

        library: "app",
        libraryTarget: "commonjs2"
    },
    context: path.resolve(__dirname, ".."),
    resolve: {
        modules: [
            path.join(__dirname, "../../"),
            path.join(ROOT, "node_modules")
        ],

        extensions: [".js", ".jsx", ".ts", ".tsx", ".scss"],

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
                        loader: "style-loader/locals"
                    },
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
        new webpack.BannerPlugin({
            banner: 'require("source-map-support").install();',
            raw: true,
            entryOnly: false
        }),
    ],
    // devServer: {
    //     headers: {
    //         "Access-Control-Allow-Origin": DEV_PROTOCOL + "://" + DEV_DOMAIN
    //     },
    //     hot: true,
    //     contentBase: path.resolve(__dirname, ".."),
    //     stats: "errors-only",
    //     host: DEV_HOST,
    //     port: DEV_PORT,
    //     open: false,
    //     public: "0.0.0.0" + ":" + DEV_PORT,
    //     historyApiFallback: true,
    //     watchOptions: {
    //         aggregateTimeout: 300,
    //         poll: 1000
    //     },
    //     https: DEV_PROTOCOL === "https",
    //     // proxy: proxyRules,
    //     // before: (app => {
    //     //     app.use(compression());
    //     //     app.use(bodyParser.json({limit: "10mb", extended: true}));
    //     //
    //     //     app.get(["/target/*"], function(req, res) {
    //     //         let url = req.params[0];
    //     //
    //     //         if (url.substr(-1) === "/") {
    //     //             url = url.slice(0, -1);
    //     //         }
    //     //
    //     //         let pathName = path.resolve(ROOT, "target", url);
    //     //
    //     //         if (fs.existsSync(pathName)) {
    //     //             const stats = fs.lstatSync(pathName);
    //     //
    //     //             if (stats.isDirectory()) {
    //     //                 pathName += "/index.html";
    //     //             }
    //     //
    //     //             res.sendFile(pathName);
    //     //         } else {
    //     //             console.error("404: ", url, req.params[0]);
    //     //
    //     //             res
    //     //                 .status(404)
    //     //                 .send("Not found");
    //     //         }
    //     //     });
    //     //
    //     //     app.get(["/ckeditor/*"], (req, res) => {
    //     //         let params = Object.keys(req.params).map(function (key) { return req.params[key]; }).filter(i => i);
    //     //
    //     //         let url = params[params.length - 1];
    //     //
    //     //         if (url.substr(-1) === "/") {
    //     //             url = url.slice(0, -1);
    //     //         }
    //     //
    //     //         let pathName = path.resolve(ROOT, "node_modules/ckeditor", url);
    //     //
    //     //         if (fs.existsSync(pathName)) {
    //     //             let stats = fs.lstatSync(pathName);
    //     //
    //     //             if (stats.isDirectory()) {
    //     //                 pathName += "/index.html";
    //     //             }
    //     //
    //     //             res.sendFile(pathName);
    //     //         } else {
    //     //             console.error("404: ", url, req.params[0]);
    //     //
    //     //             res
    //     //                 .status(404)
    //     //                 .send("Not found");
    //     //         }
    //     //     });
    //     //
    //     //     app.get("/swagger-ui/*", function(req, res) {
    //     //         let url = req.params[0];
    //     //
    //     //         if (url.substr(-1) === "/") {
    //     //             url = url.slice(0, -1);
    //     //         }
    //     //
    //     //         let pathName = path.resolve(ROOT, "../etc/swagger-ui/", url);
    //     //
    //     //         if (fs.existsSync(pathName)) {
    //     //             if (url === "swagger.json") {
    //     //                 const payload = JSON.parse(fs.readFileSync(pathName, "utf8"));
    //     //
    //     //                 payload.host = DEV_DOMAIN;
    //     //                 payload.schemes = [DEV_PROTOCOL];
    //     //
    //     //                 res.send(JSON.stringify(payload));
    //     //             } else {
    //     //                 const stats = fs.lstatSync(pathName);
    //     //
    //     //                 if (stats.isDirectory()) {
    //     //                     pathName += "/index.html";
    //     //                 }
    //     //
    //     //                 res.sendFile(pathName);
    //     //             }
    //     //         } else {
    //     //             console.error("404: ", url, req.params[0]);
    //     //
    //     //             res
    //     //                 .status(404)
    //     //                 .send("Not found");
    //     //         }
    //     //     });
    //     //
    //     //     app.post("/__debug/documents", function(req, res) {
    //     //         const filename = path.join(ROOT, "target/documents.json");
    //     //
    //     //         fs.writeFile(filename, JSON.stringify(req.body), "utf8", function(err){
    //     //             if (err) {
    //     //                 console.log(err);
    //     //             } else {
    //     //                 console.log("Successfully written documents to " + filename);
    //     //
    //     //                 res
    //     //                     .status(204)
    //     //                     .send("Success");
    //     //             }
    //     //         });
    //     //     });
    //     //
    //     //     app.post("/__debug/document", function(req, res) {
    //     //         const filename = path.join(ROOT, "target/document-" + req.body.id + ".json");
    //     //
    //     //         fs.writeFile(filename, JSON.stringify(req.body), "utf8", function(err){
    //     //             if (err) {
    //     //                 console.log(err);
    //     //             } else {
    //     //                 console.log("Successfully written document to " + filename);
    //     //
    //     //                 res
    //     //                     .status(204)
    //     //                     .send("Success");
    //     //             }
    //     //         });
    //     //     });
    //     // })
    // }
};
