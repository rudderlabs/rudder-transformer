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
  if (context) Bugsnag.setContext(context);
  if (metadata) Bugsnag.addMetadata("metadata", metadata);

  Bugsnag.notify(err);

  // Clear context and metadata if set
  if (context) Bugsnag.setContext("");
  if (metadata) Bugsnag.clearMetadata("metadata");
}

module.exports = {
  init,
  notify
};
