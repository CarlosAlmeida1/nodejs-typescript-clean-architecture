module.exports = {
  preset: "@shelf/jest-mongodb",
  testEnvironment: "node",
  collectCoverageFrom: [
    "<rootDir>/src/**/*.ts",
    "!<rootDir>/src/main/**",
    "!<rootDir>/src/main/**",
    "!<rootDir>/src/**/*-protocols.ts",
    "!**/protocols/**",
    "!**/test/**",
  ],
  coverageDirectory: "coverage",
  coverageProvider: "babel",
  testMatch: ["**/__tests__/**/*.[jt]s?(x)", "**/?(*.)+(spec|test).[jt]s?(x)"],
  roots: ["<rootDir>/src"],
  transform: {
    ".+\\.ts$": "ts-jest",
  },
};
