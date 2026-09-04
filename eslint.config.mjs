import { defineConfig } from "eslint/config";
import nextObusk from "@obusk/eslint-config-next";

const eslintConfig = defineConfig([
    ...nextObusk,
    {
        settings: {
            react: { version: "19" },
            tailwindcss:
                /** @type {import('eslint-plugin-tailwindcss').PluginSettings} */
                ({
                    functions: ["clsx", "cx", "cva", "twMerge", "tw"],
                    parseKeyFunctions: ["clsx", "cx"],
                    cssConfigPath: "./src/app/globals.css",
                }),
        },
    },
    {
        files: ["**/*.test.ts", "**/*.test.tsx"],
        rules: {
            "jsdoc/check-tag-names": [
                "error",
                { definedTags: ["jest-environment"] },
            ],
        },
    },
]);

export default eslintConfig;
