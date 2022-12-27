/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  testMatch: ["**/src/**/*.test.ts"],
  resolver: "jest-ts-webcompat-resolver",
  collectCoverageFrom: [
    "src/**/*.ts",
    "!src/index.ts",
    "!src/utils/loadJson.ts",
    "!src/server/startServer.ts",
    "!src/database/connectDatabase.ts",
    "!src/setupTests.ts",
  ],
};
