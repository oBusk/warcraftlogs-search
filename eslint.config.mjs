import nextObusk from "@obusk/eslint-config-next";

const eslintConfig = [
    ...nextObusk,
    {
        rules: {
            "prettier/prettier": "off",
            "import/order": "off",
        },
        settings: {
            react: { version: "19" },
            tailwindcss: {
                functions: ["clsx", "cx", "cva", "twMerge"],
                parseKeyFunctions: ["clsx", "cx", "cva"],
                cssConfigPath: "src/app/globals.css",
            },
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
];

export default eslintConfig;
