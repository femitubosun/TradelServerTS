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
    "^Domain/(.*)$": "<rootDir>/src/Domain/$1",
    "^Utils/(.*)$": "<rootDir>/src/Utils/$1",
    "^Logic/(.*)$": "<rootDir>/src/Logic/$1",
    "^Web/(.*)$": "<rootDir>/src/Web/$1",
    "^AppConfig/(.*)$": "<rootDir>/src/Config/$1",
    "^Entities/(.*)$": "<rootDir>/src/Entities/$1",
  },
};
