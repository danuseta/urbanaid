/** @type {import('jest').Config} */
const config = {
  testMatch: ['**/tests/**/*.test.[jt]s?(x)'],
  // The paths to modules that run some code to configure or set up the testing environment before each test
  testEnvironment: './src/JSDOMEnvironmentPatch.js',
  // A map from regular expressions to paths to transformers
  transform: {
      '^.+\\.(js|ts)$': 'babel-jest',
  },
};

module.exports = config;