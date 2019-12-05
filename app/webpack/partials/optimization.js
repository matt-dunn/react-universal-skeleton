module.exports = ({environment}) => ({
    optimization: (function(){
        return {
            // splitChunks: {
            //     cacheGroups: {
            //         commons: { test: /[\\/](lodash|core-js)[\\/]/, name: "common", chunks: "all" },
            //         commons1: { test: /[\\/](@emotion|react-toastify)[\\/]/, name: "common", chunks: "all" }
            //         // commons: { test: /[\\/]node_modules[\\/]/, name: "common", chunks: "all" }
            //     }
            // }
            // runtimeChunk: 'single',
            // splitChunks: {
            //     chunks: 'all',
            //     maxInitialRequests: Infinity,
            //     minSize: 0,
            //     cacheGroups: {
            //         vendor: {
            //             test: /[\\/]node_modules[\\/]/,
            //             name(module) {
            //                 // get the name. E.g. node_modules/packageName/not/this/part.js
            //                 // or node_modules/packageName
            //                 const packageName = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)[1];
            //
            //                 // npm package names are URL-safe, but some servers don't like @ symbols
            //                 return `npm.${packageName.replace('@', '')}`;
            //             },
            //         },
            //     },
            // },
        };
    })(environment)
});
