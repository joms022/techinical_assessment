require('dotenv').config();
const path = require('node:path');
const { JSONReporter, HTMLReportGenerator } = require('wdio-json-html-reporter');

const reportDir = path.resolve(__dirname, '../test-results/android');

exports.config = {
  runner: 'local',
  specs: ['./test/specs/**/*.spec.js'],
  maxInstances: 1,
  hostname: '127.0.0.1',
  port: 4723,
  path: '/',
  logLevel: 'warn',
  bail: 0,
  waitforTimeout: 10000,
  connectionRetryTimeout: 120000,
  connectionRetryCount: 2,
  framework: 'mocha',
  reporters: [
    'spec',
    [JSONReporter, { outputFile: path.join(reportDir, 'results.json'), screenshotOption: 'OnFailure' }]
  ],

  capabilities: [{
    platformName: 'Android',
    'appium:automationName': 'UiAutomator2',
    'appium:deviceName': process.env.ANDROID_DEVICE_NAME,
    'appium:platformVersion': process.env.ANDROID_PLATFORM_VERSION,
    'appium:appPackage': process.env.ANDROID_APP_PACKAGE,
    'appium:appActivity': process.env.ANDROID_APP_ACTIVITY,
    'appium:autoGrantPermissions': true,
    'appium:noReset': false
  }],

  mochaOpts: {
    ui: 'bdd',
    timeout: 120000
  },

  beforeTest: function (_test) {
    console.log(`\n[TC START] ${_test.title}`);
  },

  afterTest: async function (_test, _context, result) {
    console.log(`[TC ${result.passed ? 'PASS' : 'FAIL'}] ${_test.title}`);
    if (!result.passed) {
      const safeName = _test.title.replace(/[^a-z0-9]+/gi, '-').toLowerCase();
      await browser.saveScreenshot(`./screenshots/android-${safeName}.png`);
    }
  },

  onComplete: async function () {
    const reportGenerator = new HTMLReportGenerator(path.join(reportDir, 'report.html'));
    await reportGenerator.convertJSONFolderToHTML(reportDir);
  }
};
