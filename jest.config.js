module.exports = {
  preset: 'ts-jest/presets/js-with-babel',
  testEnvironment: 'node',
  verbose: true,
  collectCoverageFrom: [
    'app/**/*.{js,jsx,ts,tsx}',
    'components/**/*.{js,jsx,ts,tsx}',
    '!**/node_modules/**',
    '!**/dist/**',
    '!**/test/**'
  ],
  coverageDirectory: "./reports/coverage",
  setupFiles: ['./test/setupTests.js'],
  snapshotSerializers: ['enzyme-to-json/serializer'],
  reporters: [
    'default',
    ['jest-junit', { outputDirectory: './reports' }],
  ],
};
