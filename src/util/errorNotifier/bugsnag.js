/* eslint-disable no-param-reassign */
const Bugsnag = require('@bugsnag/js');
const stackTraceParser = require('stacktrace-parser');
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
} = require('@rudderstack/integrations-lib');
const { inspect } = require('util');
const { FilteredEventsError } = require('../../v0/util/errorTypes');
const logger = require('../../logger');
const pkg = require('../../../package.json');

const {
  BUGSNAG_API_KEY: apiKey,
  transformer_build_version: imageVersion,
  git_commit_sha: gitCommitSHA,
} = process.env;

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
  FilteredEventsError,
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
          gitCommitSHA,
        },
      },
      onError(event) {
        event.severity = 'error';
      },
      onUncaughtException(err) {
        logger.error('Uncaught exception occurred, initiating graceful shutdown', {
          error: err.message || inspect(err),
          stack: err.stack,
        });
        // Emit SIGTERM for graceful shutdown instead of process.exit(1)
        process.emit('SIGTERM');
      },
    });
  } else {
    logger.error(`Invalid Bugsnag API key: ${apiKey}`);
  }
}

function notify(err, context, metadata) {
  logger.debug('error occurred', {
    error: err.message,
    stack: err.stack,
    metadata,
    context,
  });

  if (!bugsnagClient) return;

  const isDeniedErrType = errorTypesDenyList.some((errType) => err instanceof errType);
  if (isDeniedErrType) return;

  const isDeniedErrPath = pathsDenyList.some((denyPath) =>
    stackTraceParser.parse(err.stack)?.[0]?.file?.includes(denyPath),
  );
  if (isDeniedErrPath) return;

  logger.error('Unknown error occurred', {
    error: err.message,
    stack: err.stack,
    metadata,
    context,
  });

  bugsnagClient.notify(err, (event) => {
    event.addMetadata('metadata', { ...metadata, opContext: context });
  });
}

module.exports = {
  init,
  notify,
};
