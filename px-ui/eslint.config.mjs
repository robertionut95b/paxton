// @ts-check
import { fixupConfigRules, fixupPluginRules } from "@eslint/compat";
import { FlatCompat } from "@eslint/eslintrc";
import { default as js } from "@eslint/js";
import * as graphqlEslint from "@graphql-eslint/eslint-plugin";
import * as tanstackQuery from "@tanstack/eslint-plugin-query";
import typescriptEslint from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import prettier from "eslint-plugin-prettier";
import react from "eslint-plugin-react";
import reactCompiler from "eslint-plugin-react-compiler";
import reactHooks from "eslint-plugin-react-hooks";
import globals from "globals";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all
});

export default [{
    ignores: ["src/gql/generated.ts"],
}, ...fixupConfigRules(compat.extends(
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:react-hooks/recommended",
    "plugin:prettier/recommended",
    "plugin:@tanstack/eslint-plugin-query/recommended",
)), {
    plugins: {
        react: fixupPluginRules(react),
        "@typescript-eslint": fixupPluginRules(typescriptEslint),
        "react-hooks": fixupPluginRules(reactHooks),
        prettier: fixupPluginRules(prettier),
        "@tanstack/eslint-plugin-query": fixupPluginRules(tanstackQuery),
        "react-compiler": reactCompiler,
    },

    languageOptions: {
        globals: {
            ...globals.browser,
        },

        parser: tsParser,
        ecmaVersion: "latest",
        sourceType: "module",
    },

    settings: {
        react: {
            version: "detect",
        },
    },

    rules: {
        "react/react-in-jsx-scope": "off",

        "react/jsx-filename-extension": [1, {
            extensions: [".js", ".jsx", ".ts", ".tsx"],
        }],

        "react/prop-types": "off",

        "@typescript-eslint/no-unused-vars": ["error", {
            ignoreRestSiblings: true,
        }],

        "react-compiler/react-compiler": "error",
    },
}, {
    files: ["**/*.graphql"],

    plugins: { "@graphql-eslint": fixupPluginRules(graphqlEslint) },

    languageOptions: {
        parser: { ...graphqlEslint, meta: { name: "@graphql-eslint" } },
        ecmaVersion: 5,
        sourceType: "script",

        parserOptions: {
            schema: "../src/main/resources/schema/schema.graphqls",
        },
    },

    rules: {
        "@graphql-eslint/known-type-names": "error",
    },
}];