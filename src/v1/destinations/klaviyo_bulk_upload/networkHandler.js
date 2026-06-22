const {
  AbortedError,
  NetworkError,
  RetryableError,
  ThrottledError,
  TAG_NAMES,
} = require('@rudderstack/integrations-lib');
const { prepareProxyRequest, proxyRequest } = require('../../../adapters/network');
const {
  processAxiosResponse,
  getDynamicErrorType,
} = require('../../../adapters/utils/networkUtils');
const {
  isHttpStatusSuccess,
  isHttpStatusRetryable,
  isHttpStatusThrottled,
} = require('../../../v0/util');

const DESTINATION = 'klaviyo_bulk_upload';
const PROFILE_EMAIL_POINTER_PATTERN =
  /^\/data\/attributes\/profiles\/data\/(\d+)\/attributes\/email$/;
const PROFILE_POINTER_PATTERN = /^\/data\/attributes\/profiles\/data\/(\d+)(?:\/|$)/;

const getErrorMessage = (error) =>
  error?.detail || error?.title || error?.message || error?.code || JSON.stringify(error);

const isEmailValidationError = (error) => {
  const pointer = error?.source?.pointer;
  if (typeof pointer === 'string' && PROFILE_EMAIL_POINTER_PATTERN.test(pointer)) {
    return true;
  }

  const errorText = [error?.message, error?.code, error?.detail, error?.title]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();
  return (
    errorText.includes('email') && (errorText.includes('invalid') || errorText.includes('valid'))
  );
};

const getInvalidEmailIndexes = (response) => {
  if (!Array.isArray(response?.errors)) {
    return new Map();
  }

  const invalidEmailIndexes = new Map();
  response.errors.forEach((error) => {
    const pointer = error?.source?.pointer;
    const pointerMatch =
      typeof pointer === 'string' ? pointer.match(PROFILE_POINTER_PATTERN) : null;
    if (pointerMatch && isEmailValidationError(error)) {
      invalidEmailIndexes.set(Number(pointerMatch[1]), getErrorMessage(error));
    }
  });

  return invalidEmailIndexes;
};

const getRetryableUnbatchedStates = (rudderJobMetadata, errorMessage, statusCode = 500) =>
  rudderJobMetadata.map((metadata) => ({
    statusCode: metadata.dontBatch ? 400 : statusCode,
    metadata: {
      ...metadata,
      dontBatch: true,
    },
    error: errorMessage,
  }));

const getPartialInvalidEmailStates = (rudderJobMetadata, invalidEmailIndexes, errorMessage) =>
  rudderJobMetadata.map((metadata, index) => {
    const invalidEmailError = invalidEmailIndexes.get(index);
    if (invalidEmailError) {
      return {
        statusCode: 400,
        metadata,
        error: invalidEmailError,
      };
    }

    return {
      statusCode: 500,
      metadata: {
        ...metadata,
        dontBatch: true,
      },
      error: errorMessage,
    };
  });

const responseHandler = (responseParams) => {
  const { destinationResponse, rudderJobMetadata } = responseParams;
  const metadataArray = Array.isArray(rudderJobMetadata) ? rudderJobMetadata : [rudderJobMetadata];
  const message = `[${DESTINATION} Response Handler] - Request Processed Successfully`;
  const { response, status } = destinationResponse;

  if (isHttpStatusSuccess(status)) {
    return {
      status,
      message,
      destinationResponse,
      response: metadataArray.map((metadata) => ({
        statusCode: 200,
        metadata,
        error: 'success',
      })),
    };
  }

  const errorMessage = JSON.stringify(response) || 'unknown error';
  if (status === 400) {
    const invalidEmailIndexes = getInvalidEmailIndexes(response);
    if (invalidEmailIndexes.size > 0) {
      return {
        status: 200,
        message: `[${DESTINATION} Response Handler] - Request Processed with Errors`,
        destinationResponse,
        response: getPartialInvalidEmailStates(metadataArray, invalidEmailIndexes, errorMessage),
      };
    }

    if (metadataArray.length > 1) {
      return {
        status: 200,
        message: `[${DESTINATION} Response Handler] - Request Processed with Errors`,
        destinationResponse,
        response: getRetryableUnbatchedStates(metadataArray, errorMessage),
      };
    }

    throw new AbortedError(
      `Request failed during ${DESTINATION} response transformation: with status "${status}" due to ${errorMessage}, (Aborted)`,
      status,
      destinationResponse,
    );
  }

  if (isHttpStatusRetryable(status)) {
    throw new RetryableError(
      `Request failed during ${DESTINATION} response transformation: with status "${status}" due to ${errorMessage}, (Retryable)`,
      status,
      destinationResponse,
    );
  }

  if (isHttpStatusThrottled(status)) {
    throw new ThrottledError(
      `Request failed during ${DESTINATION} response transformation: with status "${status}" due to ${errorMessage}, (Throttled)`,
      destinationResponse,
    );
  }

  throw new NetworkError(
    `Request failed during ${DESTINATION} response transformation: with status "${status}" due to ${errorMessage}`,
    status,
    {
      [TAG_NAMES.ERROR_TYPE]: getDynamicErrorType(status),
    },
    destinationResponse,
  );
};

function networkHandler() {
  this.prepareProxy = prepareProxyRequest;
  this.proxy = proxyRequest;
  this.processAxiosResponse = processAxiosResponse;
  this.responseHandler = responseHandler;
}

module.exports = { networkHandler };
