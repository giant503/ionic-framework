'use strict';

const fs = require('fs');
const glob = require('glob');
const Mocha = require('mocha');
const path = require('path');
const webdriver = require('selenium-webdriver');

const Page = require('./e2e-test-page');
const Snapshot = require('./snapshot');

let driver;
let snapshot;
let specIndex = 0;
let takeScreenshots = false;

function startDevServer() {
  const server = require('@stencil/dev-server/dist'); // TODO: fix after stencil-dev-server PR #16 is merged
  const cmdArgs = ['--config', path.join(__dirname, '../stencil.config.js'), '--no-open'];

  return server.run(cmdArgs);
}

function generateTestId() {
  let chars = 'abcdefghjkmnpqrstuvwxyz';
  let id = chars.charAt(Math.floor(Math.random() * chars.length));
  chars += '0123456789';
  while (id.length < 3) {
    id += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return id;
}

function getTestFiles() {
  return new Promise((resolve, reject) => {
    const src = path.join(__dirname, '../../src/**/e2e.js');
    glob(src, (err, files) => {
      if (err) {
        reject(err);
      } else {
        resolve(files);
      }
    });
  });
}

function processCommandLine() {
  process.argv.forEach(arg => {
    if (arg === '--snapshot') {
      takeScreenshots = true;
    }
  });
}

function registerE2ETest(desc, tst) {
  // NOTE: Do not use an arrow function here because: https://mochajs.org/#arrow-functions
  it(desc, async function() {
    await tst(driver);
    if (takeScreenshots) {
      await snapshot.takeScreenshot(driver, {
        name: this.test.fullTitle(),
        specIndex: specIndex++
      });
    }
    return Promise.resolve(true);
  });
}

function getTotalTests(suite) {
  let ttl = suite.tests.length;
  suite.suites.forEach(s => (ttl += getTotalTests(s)));
  return ttl;
}

async function run() {
  const mocha = new Mocha({
    timeout: 5000,
    slow: 2000
  });

  driver = new webdriver.Builder().forBrowser('chrome').build();

  processCommandLine();

  const devServer = await startDevServer();

  const files = await getTestFiles();
  files.forEach(f => mocha.addFile(f));
  mocha.loadFiles(() => {
    specIndex = 0;

    snapshot = new Snapshot({
      groupId: 'ionic-core',
      appId: 'snapshots',
      testId: generateTestId(),
      domain: 'ionic-snapshot-go.appspot.com',
      // domain: 'localhost:8080',
      sleepBetweenSpecs: 750,
      totalSpecs: getTotalTests(mocha.suite),
      platformDefaults: {
        browser: 'chrome',
        platform: 'linux',
        params: {
          platform_id: 'chrome_400x800',
          platform_index: 0,
          platform_count: 1,
          width: 400,
          height: 800
        }
      },
      accessKey: process.env.IONIC_SNAPSHOT_KEY
    });

    mocha.run(function(failures) {
      process.on('exit', function() {
        process.exit(failures); // exit with non-zero status if there were failures
      });
      if (takeScreenshots) {
        snapshot.finish();
      }
      devServer.close();
      driver.quit();
    });
  });
}

const navigate = url => driver => new Page(driver, url).navigate();

// Invoke run() only if executed directly i.e. `node ./scripts/e2e`
if (require.main === module) {
  run();
}

module.exports = {
  Page,
  navigate,
  register: registerE2ETest,
  run: run
};
