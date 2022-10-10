const Bugsnag = require("@bugsnag/js");
const pkg = require("../../package.json");

const {
  BUGSNAG_API_KEY: apiKey,
  transformer_build_version: imageVersion
} = process.env;

function init() {
  Bugsnag.start({
    apiKey,
    appVersion: pkg.version,
    metadata: {
      image: {
        version: imageVersion
      }
    },
    }
  });
}

function notify(err) {
  Bugsnag.notify(err);
}

module.exports = {
  init,
  notify
};
