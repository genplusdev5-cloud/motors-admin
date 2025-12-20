const {
    defineConfig,
} = require("eslint/config");

const {
    fixupConfigRules,
} = require("@eslint/compat");

const js = require("@eslint/js");

const {
    FlatCompat,
} = require("@eslint/eslintrc");

const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all
});

module.exports = defineConfig([{
    extends: fixupConfigRules(
        compat.extends("next/core-web-vitals", "plugin:import/recommended", "prettier"),
    ),

    rules: {
        "jsx-a11y/alt-text": "off",
        "react/display-name": "off",
        "react/no-children-prop": "off",
        "@next/next/no-img-element": "off",
        "@next/next/no-page-custom-font": "off",
        "newline-before-return": "off",
        "padding-line-between-statements": "off",
        "import/newline-after-import": "off",
        "import/order": "off",
        "lines-around-comment": "off",
    },

    settings: {
        react: {
            version: "detect",
        },

        "import/resolver": {
            node: {},

            typescript: {
                project: "./jsconfig.json",
            },
        },
    },
}]);
