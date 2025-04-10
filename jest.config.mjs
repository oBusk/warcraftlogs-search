/** @type {import('jest').Config} */
const config = {
    collectCoverageFrom: ["src/**/*.{js,ts,jsx,tsx}", "!**/*.d.ts"],
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
        "^\\^/(.*)$": "<rootDir>/src/$1",
    },
    testPathIgnorePatterns: ["<rootDir>/node_modules/", "<rootDir>/.next/"],
    transform: {
        // Use babel-jest to transpile tests with the next/babel preset
        // https://jestjs.io/docs/configuration#transform-objectstring-pathtotransformer--pathtotransformer-object
        "^.+\\.(js|jsx|ts|tsx)$": ["babel-jest", { presets: ["next/babel"] }],
    },
    transformIgnorePatterns: [
        "/node_modules/",
        "^.+\\.module\\.(css|sass|scss)$",
    ],
};

export default config;
