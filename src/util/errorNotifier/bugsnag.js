/* eslint-disable no-param-reassign */
const Bugsnag = require('@bugsnag/js');
const {
  CustomError: CDKCustomError,
  DataValidationError,
} = require('rudder-transformer-cdk/build/error/index');
const stackTraceParser = require('stacktrace-parser');
const { logger } = require('../../logger');
const pkg = require('../../../package.json');

const {
  BaseError,
  TransformationError,
  ConfigurationError,
  InstrumentationError,
  PlatformError,
  OAuthSecretError,
  NetworkError,
  ThrottledError,
  RetryableError,
  InvalidAuthTokenError,
  AbortedError,
  UnhandledStatusCodeError,
  UnauthorizedError,
  NetworkInstrumentationError,
} = require('../../v0/util/errorTypes');

const { BUGSNAG_API_KEY: apiKey, transformer_build_version: imageVersion, git_commit_sha: gitCommitSHA } = process.env;

const errorTypesDenyList = [
  BaseError,
  TransformationError,
  ConfigurationError,
  InstrumentationError,
  PlatformError,
  OAuthSecretError,
  NetworkError,
  ThrottledError,
  RetryableError,
  InvalidAuthTokenError,
  AbortedError,
  UnhandledStatusCodeError,
  UnauthorizedError,
  NetworkInstrumentationError,
  CDKCustomError,
  DataValidationError,
];

const pathsDenyList = [
  '/src/warehouse/',
  '/src/util/custom', // User-transformation files
];

let bugsnagClient;

function init() {
  if (apiKey) {
    bugsnagClient = Bugsnag.start({
      apiKey,
      appVersion: pkg.version,
      metadata: {
        image: {
          version: imageVersion,
        },
        source: {
          gitCommitSHA
        }
      },
      onError(event) {
        event.severity = 'error';
      },
    });
  } else {
    logger.error(`Invalid Bugsnag API key: ${apiKey}`);
  }
}

function notify(err, context, metadata) {
  if (!bugsnagClient) return;

  const isDeniedErrType = errorTypesDenyList.some((errType) => err instanceof errType);
  if (isDeniedErrType) return;

  const isDeniedErrPath = pathsDenyList.some((denyPath) =>
    stackTraceParser.parse(err.stack)?.[0]?.file?.includes(denyPath),
  );
  if (isDeniedErrPath) return;

  bugsnagClient.notify(err, (event) => {
    event.addMetadata('metadata', { ...metadata, opContext: context });
  });
}

module.exports = {
  init,
  notify,
};
