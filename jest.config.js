module.exports = {
  preset: 'ts-jest/presets/js-with-babel',
  testEnvironment: 'node',
  verbose: true,
  collectCoverageFrom: [
    '**/*.{js,jsx,ts,tsx}',
    '!**/node_modules/**',
    '!**/dist/**',
    '!**/test/**'
  ],
  setupFiles: ['./test/setupTests.js'],
  snapshotSerializers: ['enzyme-to-json/serializer'],
  reporters: [
    'default',
    ['jest-junit', { outputDirectory: './target' }],
  ],
};
