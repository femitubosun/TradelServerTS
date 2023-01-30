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
    "^Logic/(.*)$": "<rootDir>/logic/$1",
    "^Web/(.*)$": "<rootDir>/web/$1",
    "^Domain/(.*)$": "<rootDir>/domain/$1",
  },
};
