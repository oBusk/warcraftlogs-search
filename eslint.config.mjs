import js from "@eslint/js";
import tseslint from "typescript-eslint";

const eslintConfig = [
    js.configs.recommended,
    ...tseslint.configs.recommended,
    {
        rules: {
            "@typescript-eslint/no-unused-vars": [
                "error",
                {
                    argsIgnorePattern: "^_",
                    varsIgnorePattern: "^_",
                },
            ],
        },
    },
];

export default eslintConfig;
