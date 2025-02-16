module.exports = {
  testEnvironment: "node",
  verbose: true,
  collectCoverageFrom: [
    "app/**/*.{js,jsx,ts,tsx}",
    "components/**/*.{js,jsx,ts,tsx}",
    "!**/node_modules/**",
    "!**/dist/**",
    "!**/test/**",
    "!**/*.d.ts"
  ],
  coverageDirectory: "./reports/coverage",
  // setupFiles: ["./test/setupTests.js"],
  setupFilesAfterEnv: ["./test/setupTests.js"],
  snapshotSerializers: ["enzyme-to-json/serializer", "jest-emotion"],
  reporters: [
    "default",
    ["jest-junit", { outputDirectory: "./reports" }],
  ],
};
