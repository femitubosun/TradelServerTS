export default {
  preset: "ts-jest",
  testEnvironment: "node",
  clearMocks: true,
  collectCoverage: true,
  coverageDirectory: "coverage",
  coverageProvider: "v8",
  roots: ["<rootDir>"],
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  moduleNameMapper: {
    "^Lib/(.*)$": "<rootDir>/src/Lib/$1",
    "^Utils/(.*)$": "<rootDir>/src/Utils/$1",
    "^Logic/(.*)$": "<rootDir>/src/Logic/$1",
    "^Api/(.*)$": "<rootDir>/src/Api/$1",
    "^Config/(.*)$": "<rootDir>/src/Config/$1",
    "^Helpers/(.*)$": "<rootDir>/src/Helpers/$1",
    "^Exceptions/(.*)$": "<rootDir>/src/Exceptions/$1",
    "^Entities/(.*)$": "<rootDir>/src/Entities/$1",
    "^TypeChecking/(.*)$": "<rootDir>/src/TypeChecking/$1",
  },
};
