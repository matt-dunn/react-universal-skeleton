module.exports =  {
    plugins: [
        "react-hooks",
        "jam3"
    ],
    env: {
        es6: true,
        browser: true,
        jest: true,
        node: true
    },
    parserOptions:  {
        ecmaVersion:  2018,
        sourceType:  "module",
        ecmaFeatures:  {
            jsx:  true,
        },
    },
    parser:  "@typescript-eslint/parser",
    extends:  [
        "eslint:recommended",
        "plugin:react/recommended"
    ],
    globals: {
    },
    overrides: [
        {
            files: ["*.ts", "*.tsx"],
            extends:  [
                "plugin:@typescript-eslint/recommended",
            ],
            rules:  {
                "@typescript-eslint/ban-ts-ignore": "error",
                "@typescript-eslint/camelcase": "off",
                "@typescript-eslint/explicit-function-return-type": "off",
                "@typescript-eslint/no-explicit-any": "off",
            },
        }
    ],
    settings: {
        react: {
            version: "detect"
        },
        // "import/resolver": {
        //     "node": {
        //         "extensions": [
        //             ".js",
        //             ".jsx",
        //             ".tsx",
        //             ".ts"
        //         ]
        //     }
        // }
    },
    rules:  {
        "react-hooks/rules-of-hooks": "error",
        "react-hooks/exhaustive-deps": "warn",
        "jam3/no-sanitizer-with-danger": [2, {wrapperName: ["sanitize"]}],
        "jam3/no-sanitizer-window-location": 2,
        "semi": 2,
        "semi-spacing": [2, {"before": false, "after": true}],
        "quotes": [2, "double", "avoid-escape"],
        "jsx-quotes": [1, "prefer-double"],
        "quote-props": 0,
    }
};
