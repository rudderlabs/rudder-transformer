/* eslint-disable no-param-reassign */
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
    onError(event) {
      event.severity = "error";
    }
  });
}

function notify(err, context, metadata) {
  Bugsnag.notify(err, event => {
    event.context = context;
    event.addMetadata("metadata", metadata);
  });
}

module.exports = {
  init,
  notify
};
