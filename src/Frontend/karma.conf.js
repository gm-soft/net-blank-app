// Karma configuration file, see link for more information
// https://karma-runner.github.io/1.0/config/configuration-file.html
const process = require('process');
process.env.CHROME_BIN = require('puppeteer').executablePath();

module.exports = function(config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine', '@angular-devkit/build-angular'],
    plugins: [
      require('karma-jasmine'),
      require('karma-chrome-launcher'),
      require('karma-jasmine-html-reporter'),
      require('karma-coverage-istanbul-reporter'),
      require('@angular-devkit/build-angular/plugins/karma'),
      'karma-spec-reporter'
    ],
    client: {
      clearContext: false // leave Jasmine Spec Runner output visible in browser
    },
    coverageIstanbulReporter: {
      dir: require('path').join(__dirname, './coverage/Frontend'),
      reports: ['html', 'lcovonly', 'text-summary'],
      fixWebpackSourcePaths: true
    },
    reporters: ['progress', 'kjhtml', 'spec'],
    specReporter: {
      suppressErrorSummary: true,  // do not print error summary
      suppressFailed: true,  // do not print information about failed tests
      suppressPassed: false,  // do not print information about passed tests
      suppressSkipped: true,  // do not print information about skipped tests
      showSpecTiming: false // print the time elapsed for each spec
    },
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    files: [
      { pattern: './src/assets/*.jpg', watched: false, included: false, served: true, nocache: false },
      { pattern: './src/assets/*.png', watched: false, included: false, served: true, nocache: false },
      { pattern: './src/assets/img/doge/*.png', watched: false, included: false, served: true, nocache: false }
    ],
    proxies: {
      '/assets/': '/base/src/assets/',
      '/assets/img/doge/': '/base/src/assets/img/doge/'
    },
    browsers: ['Chrome'],
    customLaunchers: {
      ChromiumNoSandbox: {
        base: 'ChromeHeadless',
        flags: [
          '--no-sandbox',
          '--headless',
          '--disable-gpu',
          '--disable-translate',
          '--disable-extensions'
        ]
      }
    },
    singleRun: true
  });
};
