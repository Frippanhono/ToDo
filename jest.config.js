/** @type {import('@jest/types').Config.InitialOptions} */
module.exports = {
  // The test environment that will be used for testing, jsdom for browser environment
  // https://jestjs.io/docs/configuration#testenvironment-string
  preset: 'ts-jest',
  testEnvironment: "jsdom",

  // A list of paths to directories that Jest should use to search for files in
  // https://jestjs.io/docs/configuration#roots-arraystring
  roots: ["<rootDir>/src/"],

  // The glob patterns Jest uses to detect test files.
  // https://jestjs.io/docs/configuration#testmatch-arraystring
  testMatch: ["**/*.spec.ts?(x)"],

  // Jest transformations
  // https://jestjs.io/docs/configuration#transform-objectstring-pathtotransformer--pathtotransformer-object
    preset: 'ts-jest',
    testEnvironment: 'jsdom',
    transform: {
      '^.+\\.tsx?$': 'ts-jest',
      '^.+\\.jsx?$': ['babel-jest', {
        presets: [['@babel/preset-env', { targets: { node: 'current' } }]],
      }],
    },
    transformIgnorePatterns: [
      '/node_modules/(?!(preact|@fullcalendar|tslib|fast-deep-equal)/)',
    ],

  // A list of paths to modules that run some code to configure or set up the testing framework before each test file in the suite is executed
  // https://jestjs.io/docs/configuration#setupfilesafterenv-array
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],

  // Code coverage config
  // https://jestjs.io/docs/configuration#collectcoveragefrom-array
  coverageDirectory: "<rootDir>/coverage/",
  collectCoverageFrom: [
    "<rootDir>/src/**/*.{ts,tsx}",
    "!**/__mocks__/**",
    "!**/node_modules/**",
    "!**/*.d.ts",
  ],

  // Important: order matters, specific rules should be defined first
  // https://jestjs.io/fr/docs/configuration#modulenamemapper-objectstring-string--arraystring
  moduleNameMapper: {
    // Handle CSS imports (with CSS modules)
    // https://jestjs.io/docs/webpack#mocking-css-modules
    "^.+\\.module\\.(css|sass|scss|less)$": "identity-obj-proxy",

    // Handle CSS imports (without CSS modules)
    "^.+\\.(css|sass|scss|less)$": "<rootDir>/__mocks__/styleMock.js",

    // Handle static assets
    // https://jestjs.io/docs/webpack#handling-static-assets
    "^.+\\.(jpg|jpeg|png|gif|webp|avif|svg|ttf|woff|woff2)$": `<rootDir>/__mocks__/fileMock.js`,

    // Handle TypeScript path aliases
    "^@/(.*)$": "<rootDir>/src/$1",
  },

  // Viktigt: vitlista ESM-paket som behöver transpileras
  transformIgnorePatterns: [
    "/node_modules/(?!(preact|@fullcalendar|tslib|fast-deep-equal)/)",
  ],

  verbose: true,
  testTimeout: 30000,
};
