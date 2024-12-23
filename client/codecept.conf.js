const { setHeadlessWhen, setCommonPlugins } = require('@codeceptjs/configure');
// turn on headless mode when running with HEADLESS=true environment variable
// export HEADLESS=true && npx codeceptjs run
setHeadlessWhen(process.env.HEADLESS);

// enable all common plugins https://github.com/codeceptjs/configure#setcommonplugins
setCommonPlugins();

/** @type {CodeceptJS.MainConfig} */
exports.config = {
  tests: 'e2e/**/*.test.js',
  output: 'e2e/output',
  helpers: {
    Playwright: {
      browser: 'chromium',
      waitForTimeout: 5000,
      waitForAction: 500,
      url: 'http://localhost:9000',
      show: true
    }
  },
  include: {
    I: './steps_file.js',
    loginPage: './tests/e2e/pages/login.js',
    registerPage: './tests/e2e/pages/register.js'
  },
  name: 'urbanaid'
}