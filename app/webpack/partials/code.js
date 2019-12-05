const path = require("path");

module.exports = ({root}) => ({
    module :{
        rules: [
            {
                test: /\.(js|jsx|ts|tsx)$/,
                exclude: /node_modules/,
                include: [path.resolve(root, "app"), path.resolve(root, "components"), path.resolve(root, "server")],
                use: [
                    {
                        loader: "babel-loader",
                        options: {
                            "plugins": [
                                "react-hot-loader/babel"
                            ]
                        }
                    },
                ]
            }
        ]
    }
});
