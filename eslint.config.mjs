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
                callees: ["clsx", "cx", "cva", "twMerge"],
                cssFiles: ["src/app/globals.css"],
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
    {
        name: "tailwindcss plugin disabled pending v4 support",
        rules: {
            "tailwindcss/classnames-order": "off",
            "tailwindcss/enforces-negative-arbitrary-values": "off",
            "tailwindcss/enforces-shorthand": "off",
            "tailwindcss/migration-from-tailwind-2": "off",
            "tailwindcss/no-arbitrary-value": "off",
            "tailwindcss/no-custom-classname": "off",
            "tailwindcss/no-contradicting-classname": "off",
            "tailwindcss/no-unnecessary-arbitrary-value": "off",
        },
    },
];

export default eslintConfig;
