const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CompressionPlugin = require('compression-webpack-plugin');
const BrotliPlugin = require('brotli-webpack-plugin');

const path = require('path');

const ROOT = path.join(__dirname, "../../");

const BUILD = {
    version: "DEV",
    number: "0.0.0"
};

const DEV_PROTOCOL = "https";
const DEV_PORT = 1234;
const DEV_HOST = "0.0.0.0";//"local.training.co.uk";
const DEV_DOMAIN = DEV_HOST + ":" + DEV_PORT;

const ENV = process.env.NODE_ENV || "production";

console.log("Building client....", ENV)

module.exports = {
    entry: './client.js',
    mode: ENV,
    devtool: "source-map",
    output: {
        path: path.resolve(ROOT, "dist/client"),

        filename: "[name]-[hash].js",

        sourceMapFilename: "[name]-[hash].map",

        chunkFilename: "[id]-[chunkhash].js",

        publicPath: "/"
    },
    context: path.resolve(__dirname, ".."),
    resolve: {
        modules: [
            path.join(__dirname, "../../"),
            path.join(ROOT, "node_modules")
        ],

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
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            hmr: process.env.NODE_ENV === 'development',
                        },
                    },
                    // {
                    //     loader: "style-loader"
                    // },
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
        new MiniCssExtractPlugin({
            filename: '[name]-[hash].css',
            chunkFilename: '[id]-[hash].css',
            ignoreOrder: false, // Enable to remove warnings about conflicting order
        }),
        new CompressionPlugin({
            filename: '[path].gz[query]',
            algorithm: 'gzip',
            test: /\.js$|\.css$|\.html$/,
            threshold: 10240,
            minRatio: 0.7
        }),
        new BrotliPlugin({
            asset: '[path].br[query]',
            test: /\.js$|\.css$|\.html$/,
            threshold: 10240,
            minRatio: 0.7
        }),
    ],
    devServer: {
        headers: {
            "Access-Control-Allow-Origin": DEV_PROTOCOL + "://" + DEV_DOMAIN
        },
        hot: true,
        contentBase: path.resolve(__dirname, ".."),
        stats: "errors-only",
        host: DEV_HOST,
        port: DEV_PORT,
        open: false,
        public: "0.0.0.0" + ":" + DEV_PORT,
        historyApiFallback: true,
        watchOptions: {
            aggregateTimeout: 300,
            poll: 1000
        },
        https: DEV_PROTOCOL === "https",
        // proxy: proxyRules,
        // before: (app => {
        //     app.use(compression());
        //     app.use(bodyParser.json({limit: "10mb", extended: true}));
        //
        //     app.get(["/target/*"], function(req, res) {
        //         let url = req.params[0];
        //
        //         if (url.substr(-1) === "/") {
        //             url = url.slice(0, -1);
        //         }
        //
        //         let pathName = path.resolve(ROOT, "target", url);
        //
        //         if (fs.existsSync(pathName)) {
        //             const stats = fs.lstatSync(pathName);
        //
        //             if (stats.isDirectory()) {
        //                 pathName += "/index.html";
        //             }
        //
        //             res.sendFile(pathName);
        //         } else {
        //             console.error("404: ", url, req.params[0]);
        //
        //             res
        //                 .status(404)
        //                 .send("Not found");
        //         }
        //     });
        //
        //     app.get(["/ckeditor/*"], (req, res) => {
        //         let params = Object.keys(req.params).map(function (key) { return req.params[key]; }).filter(i => i);
        //
        //         let url = params[params.length - 1];
        //
        //         if (url.substr(-1) === "/") {
        //             url = url.slice(0, -1);
        //         }
        //
        //         let pathName = path.resolve(ROOT, "node_modules/ckeditor", url);
        //
        //         if (fs.existsSync(pathName)) {
        //             let stats = fs.lstatSync(pathName);
        //
        //             if (stats.isDirectory()) {
        //                 pathName += "/index.html";
        //             }
        //
        //             res.sendFile(pathName);
        //         } else {
        //             console.error("404: ", url, req.params[0]);
        //
        //             res
        //                 .status(404)
        //                 .send("Not found");
        //         }
        //     });
        //
        //     app.get("/swagger-ui/*", function(req, res) {
        //         let url = req.params[0];
        //
        //         if (url.substr(-1) === "/") {
        //             url = url.slice(0, -1);
        //         }
        //
        //         let pathName = path.resolve(ROOT, "../etc/swagger-ui/", url);
        //
        //         if (fs.existsSync(pathName)) {
        //             if (url === "swagger.json") {
        //                 const payload = JSON.parse(fs.readFileSync(pathName, "utf8"));
        //
        //                 payload.host = DEV_DOMAIN;
        //                 payload.schemes = [DEV_PROTOCOL];
        //
        //                 res.send(JSON.stringify(payload));
        //             } else {
        //                 const stats = fs.lstatSync(pathName);
        //
        //                 if (stats.isDirectory()) {
        //                     pathName += "/index.html";
        //                 }
        //
        //                 res.sendFile(pathName);
        //             }
        //         } else {
        //             console.error("404: ", url, req.params[0]);
        //
        //             res
        //                 .status(404)
        //                 .send("Not found");
        //         }
        //     });
        //
        //     app.post("/__debug/documents", function(req, res) {
        //         const filename = path.join(ROOT, "target/documents.json");
        //
        //         fs.writeFile(filename, JSON.stringify(req.body), "utf8", function(err){
        //             if (err) {
        //                 console.log(err);
        //             } else {
        //                 console.log("Successfully written documents to " + filename);
        //
        //                 res
        //                     .status(204)
        //                     .send("Success");
        //             }
        //         });
        //     });
        //
        //     app.post("/__debug/document", function(req, res) {
        //         const filename = path.join(ROOT, "target/document-" + req.body.id + ".json");
        //
        //         fs.writeFile(filename, JSON.stringify(req.body), "utf8", function(err){
        //             if (err) {
        //                 console.log(err);
        //             } else {
        //                 console.log("Successfully written document to " + filename);
        //
        //                 res
        //                     .status(204)
        //                     .send("Success");
        //             }
        //         });
        //     });
        // })
    }
};
