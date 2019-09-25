module.exports =  {
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
            ]
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
        // Place to specify ESLint rules. Can be used to overwrite rules specified from the extended configs
        // e.g. "@typescript-eslint/explicit-function-return-type": "off",
    },
};
