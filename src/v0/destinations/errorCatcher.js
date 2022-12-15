const {
  TransformationError,
  InstrumentationError,
  ConfigurationError,
  NetworkError,
  UnauthorizedError,
  UnhandledStatusCodeError,
  NetworkInstrumentationError,
  PlatformError
} = require("../util/errorTypes");
// const TransformationError = require("./transformationError");
// const ConfigurationError = require("./configurationError");
// const InstrumentationError = require("./instrumentationError");
// const PlatformError = require("./platformError");
// const OAuthSecretError = require("./oAuthSecretError");
// const NetworkError = require("./networkError");
// const ThrottledError = require("./throttledError");
// const RetryableError = require("./retryableError");
// const InvalidAuthTokenError = require("./invalidAuthTokenError");
// const AbortedError = require("./abortedError");
// const UnhandledStatusCodeError = require("./unhandledStatusCodeError");
// const UnauthorizedError = require("./unauthorizedError");
// const NetworkInstrumentationError = require("./networkInstrumentationError");
const {
  getDynamicErrorType,
  processAxiosResponse
} = require("../../adapters/utils/networkUtils");
const tags = require("../util/tags");

const errorCatcherFunction = message => {
  if (message.errorVal === "NetworkError") {
    throw new NetworkError(
      `error message`,
      400,
      {
        [tags.TAG_NAMES.ERROR_TYPE]: getDynamicErrorType(401),
        [tags.TAG_NAMES.ERROR_CATEGORY]: tags.ERROR_CATEGORIES.NETWORK
      },
      {}
    );
  }
  if (message.errorVal === "NetworkErrorRetryable") {
    throw new NetworkError(
      `error message`,
      502,
      {
        [tags.TAG_NAMES.ERROR_TYPE]: getDynamicErrorType(502)
      },
      {}
    );
  }
  if (message.errorVal === "UnauthorizedError") {
    throw new UnauthorizedError(
      `error message`,
      400,
      {
        [tags.TAG_NAMES.ERROR_TYPE]: getDynamicErrorType(400)
      },
      {}
    );
  }
  if (message.errorVal === "NetworkThrottled") {
    throw new NetworkError(
      `error message throttled`,
      429,
      {
        [tags.TAG_NAMES.ERROR_TYPE]: getDynamicErrorType(429)
      },
      {}
    );
  }
  if (message.errorVal === "UnhandledStatusCode") {
    throw new UnhandledStatusCodeError(
      `error message unhandled`,
      800,
      {
        [tags.TAG_NAMES.ERROR_TYPE]: getDynamicErrorType(800)
      },
      {}
    );
  }
  if (message.errorVal === "instrumentation") {
    throw new NetworkError(
      `error message instrumented`,
      400,
      {
        [tags.TAG_NAMES.ERROR_TYPE]: getDynamicErrorType(400)
      },
      {}
    );
  }
};

const errCatchOnDestName = destination => {
  if (destination.Name === "NetworkError") {
    throw new NetworkError(
      `error message`,
      400,
      {
        [tags.TAG_NAMES.ERROR_TYPE]: getDynamicErrorType(401),
        [tags.TAG_NAMES.ERROR_CATEGORY]: tags.ERROR_CATEGORIES.NETWORK
      },
      {}
    );
  }
  if (destination.Name === "instrumentation") {
    throw new NetworkError(
      `error message instrumented`,
      400,
      {
        [tags.TAG_NAMES.ERROR_TYPE]: getDynamicErrorType(400),
        [tags.TAG_NAMES.META]: tags.METADATA.INSTRUMENTATION,
        [tags.TAG_NAMES.ERROR_CATEGORY]: tags.ERROR_CATEGORIES.NETWORK
      },
      {}
    );
  }
  if (destination.Name === "NetworkErrorRetryable") {
    throw new NetworkError(
      `error message`,
      502,
      {
        [tags.TAG_NAMES.ERROR_TYPE]: getDynamicErrorType(502)
      },
      {}
    );
  }
  if (destination.Name === "UnauthorizedError") {
    throw new UnauthorizedError(
      `error message`,
      400,
      {
        [tags.TAG_NAMES.ERROR_TYPE]: getDynamicErrorType(400)
      },
      {}
    );
  }
  if (destination.Name === "NetworkThrottled") {
    throw new NetworkError(
      `error message throttled`,
      429,
      {
        [tags.TAG_NAMES.ERROR_TYPE]: getDynamicErrorType(429)
      },
      {}
    );
  }
  if (destination.Name === "UnhandledStatusCode") {
    throw new UnhandledStatusCodeError(
      `error message unhandled`,
      800,
      {
        [tags.TAG_NAMES.ERROR_TYPE]: getDynamicErrorType(800)
      },
      {}
    );
  }
  if (destination.Name.includes("NetworkErrorRetryableOauth")) {
    throw new NetworkError(
      `error message`,
      502,
      {
        [tags.TAG_NAMES.ERROR_TYPE]: getDynamicErrorType(502),
        [tags.TAG_NAMES.META]: tags.METADATA.INVALID_AUTH_TOKEN
      },
      {}
    );
  }
  if (destination.Name === "pkcdk2") {
    throw new PlatformError(
      `platform error`,
      400,
      {
        [tags.TAG_NAMES.ERROR_TYPE]: getDynamicErrorType(400),
        [tags.TAG_NAMES.IMPLEMENTATION]: tags.IMPLEMENTATIONS.CDK_V2
      },
      {}
    );
  }
};

module.exports = { errorCatcherFunction, errCatchOnDestName };
