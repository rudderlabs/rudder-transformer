/* eslint-disable no-param-reassign */
const Bugsnag = require("@bugsnag/js");
const {
  CustomError: CDKCustomError,
  DataValidationError
} = require("rudder-transformer-cdk/build/error/index");
const pkg = require("../../../package.json");
const { CustomError } = require("../../v0/util");
const { ApiError, TransformationError } = require("../../v0/util/errors");

const {
  BUGSNAG_API_KEY: apiKey,
  transformer_build_version: imageVersion
} = process.env;

const errorTypesDenyList = [
  CustomError,
  ApiError,
  TransformationError,
  CDKCustomError,
  DataValidationError
];

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
  const isDeniedErrType = errorTypesDenyList.some(errType => {
    return err instanceof errType;
  });

  if (isDeniedErrType) return;

  // For errors thrown in the code using ErrorBuilder
  // TODO: This need to be cleaned up once the entire code base
  // moves into a consistent error reporting format
  if (err.isExpected === true) return;

  Bugsnag.notify(err, event => {
    event.context = context;
    event.addMetadata("metadata", metadata);
  });
}

module.exports = {
  init,
  notify
};
