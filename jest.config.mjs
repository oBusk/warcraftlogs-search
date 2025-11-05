/** @type {import('jest').Config} */
const config = {
    collectCoverageFrom: ["app/**/*.{js,ts,jsx,tsx}", "!**/*.d.ts"],
    moduleNameMapper: {
        // Handle CSS imports (with CSS modules)
        // https://jestjs.io/docs/webpack#mocking-css-modules
        "^.+\\.module\\.(css|sass|scss)$": "identity-obj-proxy",

        // Handle CSS imports (without CSS modules)
        "^.+\\.(css|sass|scss)$": "<rootDir>/__mocks__/styleMock.js",

        // Handle image imports
        // https://jestjs.io/docs/webpack#handling-static-assets
        "^.+\\.(jpg|jpeg|png|gif|webp|svg)$": "<rootDir>/__mocks__/fileMock.js",

        // Handle module aliases
        "^\\^/(.*)$": "<rootDir>/app/$1",
    },
    testPathIgnorePatterns: ["<rootDir>/node_modules/", "<rootDir>/build/"],
    testEnvironment: "node",
    transform: {
        "^.+\\.(js|jsx|ts|tsx)$": [
            "@swc/jest",
            {
                jsc: {
                    parser: {
                        syntax: "typescript",
                        tsx: true,
                    },
                    transform: {
                        react: {
                            runtime: "automatic",
                        },
                    },
                },
            },
        ],
    },
    transformIgnorePatterns: [
        "/node_modules/",
        "^.+\\.module\\.(css|sass|scss)$",
    ],
};

export default config;
