import tailwindcss from "eslint-plugin-tailwindcss";
import testingLibrary from "eslint-plugin-testing-library";
import { defineConfig } from "oxlint";

const tailwindcssRecommended: Record<string, unknown> = Object.assign(
    {},
    ...tailwindcss.configs["flat/recommended"].map((config) => config.rules),
);

const testingLibraryReact = testingLibrary.configs["flat/react"].rules;

export default defineConfig({
    plugins: [
        "eslint",
        "typescript",
        "unicorn",
        "oxc",
        "import",
        "jest",
        "jsdoc",
        "jsx-a11y",
        "nextjs",
        "react",
    ],
    jsPlugins: ["eslint-plugin-tailwindcss"],
    categories: {
        correctness: "error",
    },
    settings: {
        tailwindcss: {
            callees: ["clsx", "cx", "cva", "twMerge"],
        },
    },
    rules: {
        ...tailwindcssRecommended,
        "no-unused-vars": [
            "error",
            { argsIgnorePattern: "^_", ignoreRestSiblings: true },
        ],
        "typescript/consistent-type-imports": [
            "error",
            {
                prefer: "type-imports",
                disallowTypeAnnotations: true,
                fixStyle: "inline-type-imports",
            },
        ],
        "typescript/no-empty-object-type": "off",
        "jsdoc/require-param": "off",
        "jsdoc/require-returns": "off",
        "jsdoc/require-yields": "off",
    },
    overrides: [
        {
            files: ["**/*.test.ts", "**/*.test.tsx"],
            jsPlugins: ["eslint-plugin-testing-library"],
            env: { jest: true },
            rules: {
                ...testingLibraryReact,
                "jsdoc/check-tag-names": [
                    "error",
                    { definedTags: ["jest-environment"] },
                ],
            },
        },
    ],
});
