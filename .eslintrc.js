module.exports =  {
    "plugins": [
        "react-hooks"
    ],
    parser:  '@typescript-eslint/parser',
    extends:  [
        'plugin:react/recommended'
    ],
    parserOptions:  {
        ecmaVersion:  2018,
        sourceType:  'module',
        ecmaFeatures:  {
            jsx:  true,
        },
    },
    "overrides": [
        {
            "files": ["*.ts", "*.tsx"],
            extends:  [
                'plugin:@typescript-eslint/recommended',
            ],
            rules:  {
                "@typescript-eslint/interface-name-prefix": "off",
                "@typescript-eslint/ban-ts-ignore": "warn",
                "@typescript-eslint/camelcase": "off"
            },
        }
    ],
    "settings": {
        "react": {
            "version": "detect"
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
        "react-hooks/exhaustive-deps": "warn"
    }
};
