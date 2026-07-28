import nextObusk from "@obusk/eslint-config-next";

const eslintConfig = [
    ...nextObusk,
    {
        rules: {
            "prettier/prettier": "off",
            "import/order": "off",
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
