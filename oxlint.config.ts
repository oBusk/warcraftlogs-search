import tailwind from "eslint-plugin-tailwindcss";
import testingLibrary from "eslint-plugin-testing-library";
import { defineConfig } from "oxlint";

type FlatConfig = { rules?: Record<string, unknown> };

const rulesOf = (configs: FlatConfig[]) =>
    Object.assign({}, ...configs.map((config) => config.rules ?? {}));

export default defineConfig({
    plugins: [
        "eslint",
        "typescript",
        "unicorn",
        "oxc",
        "import",
        "react",
        "jsx-a11y",
        "nextjs",
        "jsdoc",
        "jest",
    ],
    jsPlugins: [
        "eslint-plugin-tailwindcss",
        "eslint-plugin-testing-library",
        { name: "react-js", specifier: "eslint-plugin-react" },
    ],
    categories: { correctness: "error" },
    options: { typeAware: true },
    settings: {
        react: { version: "19.2.7" },
        tailwindcss: { callees: ["clsx", "cx", "cva", "twMerge"] },
    },
    rules: {
        ...rulesOf(tailwind.configs["flat/recommended"]),
        // oxfmt's sortTailwindcss owns class ordering
        "tailwindcss/classnames-order": "off",

        "typescript/consistent-type-imports": [
            "error",
            {
                prefer: "type-imports",
                disallowTypeAnnotations: true,
                fixStyle: "inline-type-imports",
            },
        ],
        "typescript/no-unused-vars": [
            "error",
            { argsIgnorePattern: "^_", ignoreRestSiblings: true },
        ],
        "react-js/jsx-no-leaked-render": "error",
    },
    overrides: [
        {
            files: ["**/*.test.ts", "**/*.test.tsx"],
            rules: {
                ...testingLibrary.configs["flat/react"].rules,
                "jsdoc/check-tag-names": [
                    "error",
                    { definedTags: ["jest-environment"] },
                ],
            },
        },
    ],
});
