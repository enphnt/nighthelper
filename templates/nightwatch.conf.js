const seleniumServer = require("selenium-server");
const chromedriver = require("chromedriver");

module.exports = {
  "src_folders": ["test/e2e/tests"],
  "custom_commands_path": "test/e2e/commands",
  "page_objects_path": "test/e2e/pages",
  "selenium": {
    "start_process": false,
    "server_path": seleniumServer.path,
    "host": "127.0.0.1",
    "port": 4444,
    "cli_args": {
      "webdriver.chrome.driver": chromedriver.path
    }
  },
  "test_workers": true,
  "test_settings": {
    "default": {
      "launch_url": "localhost:3000",
      "desiredCapabilities": {
        "browserName": "chrome"
      },
      "globals": {
        beforeEach: function (client, done) {
          client.perform(() => {
            client
              .url("localhost:3000")
              .waitForElementVisible("body", 3000);
            done();
          });
        },
        afterEach: function (client, done) {
          client.end(function () {
            done();
          });
        },
      }
    }
  }
};
