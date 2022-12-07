const { BaseError } = require("./base");
const TransformationError = require("./transformationError");
const ConfigurationError = require("./configurationError");
const InstrumentationError = require("./instrumentationError");
const PlatformError = require("./platformError");
const OAuthSecretError = require("./oAuthSecretError");
const NetworkError = require("./networkError");
const ThrottledError = require("./throttledError");
const RetryableError = require("./retryableError");
const InvalidAuthTokenError = require("./invalidAuthTokenError");
const AbortedError = require("./abortedError");
const UnhandledStatusCodeError = require("./unhandledStatusCodeError");
const UnauthorizedError = require("./unauthorizedError");
const NetworkInstrumentationError = require("./networkInstrumentationError");

module.exports = {
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
  NetworkInstrumentationError
};
