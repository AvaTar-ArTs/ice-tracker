// backend/jest.config.mjs
export default {
  testEnvironment: 'node',
  transform: {
    '^.+\\.js$': 'babel-jest', // Use babel-jest for .js files
  },
  moduleFileExtensions: ['js', 'json', 'node'],
  roots: ['<rootDir>/src/'], // Look for tests in src/
  testMatch: ['<rootDir>/src/**/*.test.js'], // Specifically match .test.js in src/
  collectCoverage: false,
};
