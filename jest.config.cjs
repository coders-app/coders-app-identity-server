/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: "ts-jest",
  setupFiles: ["./src/setupTests.ts"],
  testEnvironment: "node",
  testMatch: ["**/src/**/*.test.ts"],
  resolver: "jest-ts-webcompat-resolver",
  collectCoverageFrom: [
    "src/**/*.ts",
    "!src/index.ts",
    "!src/setupTests.ts",
    "!src/utils/loadJson.ts",
    "!src/openapi/*.ts",
    "!src/server/startServer.ts",
    "!src/database/connectDatabase.ts",
  ],
};
