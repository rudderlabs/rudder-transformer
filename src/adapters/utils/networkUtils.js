/* eslint-disable eqeqeq */
const _ = require('lodash');
const { isEmpty } = require('lodash');
const {
  isHttpStatusRetryable,
  isDefinedAndNotNullAndNotEmpty,
  isNonFuncObject,
  isDefinedAndNotNull,
} = require('../../v0/util');
const { AbortedError } = require('../../v0/util/errorTypes');
const tags = require('../../v0/util/tags');

const nodeSysErrorToStatus = (code) => {
  const sysErrorToStatusMap = {
    EACCES: {
      status: 400,
      message: '[EACCES] :: Permission denied',
    },
    EADDRINUSE: {
      status: 400,
      message: '[EADDRINUSE] :: Address already in use',
    },
    ECONNREFUSED: {
      status: 500,
      message: '[ECONNREFUSED] :: Connection refused',
    },
    ECONNRESET: {
      status: 500,
      message: '[ECONNRESET] :: Connection reset by peer',
    },
    EEXIST: {
      status: 400,
      message: '[EEXIST] :: File exists',
    },
    EISDIR: {
      status: 400,
      message: '[EEXIST] :: Is a directory',
    },
    EMFILE: {
      status: 400,
      message: '[EMFILE] :: Too many open files in system',
    },
    ENOENT: {
      status: 400,
      message: '[ENOENT] :: No such file or directory',
    },
    ENOTDIR: {
      status: 400,
      message: '[ENOTDIR] :: Not a directory',
    },
    ENOTEMPTY: {
      status: 400,
      message: '[ENOTEMPTY] :: Directory not empty)',
    },
    ENOTFOUND: {
      status: 400,
      message: '[ENOTFOUND] :: DNS lookup failed',
    },
    EPERM: {
      status: 400,
      message: '[EPERM] :: Operation not permitted',
    },
    EPIPE: {
      status: 400,
      message: '[EPIPE] :: Broken pipe',
    },
    ETIMEDOUT: {
      status: 500,
      message: '[ETIMEDOUT] :: Operation timed out',
    },
  };
  return sysErrorToStatusMap[code] || { status: 400, message: `[${code}]` };
};

// Returns dynamic Meta based on Status Code as Input
const getDynamicErrorType = (statusCode) => {
  if (isHttpStatusRetryable(statusCode)) {
    return tags.ERROR_TYPES.RETRYABLE;
  }
  switch (statusCode) {
    case 429:
      return tags.ERROR_TYPES.THROTTLED;
    default:
      return tags.ERROR_TYPES.ABORTED;
  }
};

const parseDestResponse = (destResponse, destination = '') => {
  // validity of destResponse
  if (!isDefinedAndNotNullAndNotEmpty(destResponse) || !isNonFuncObject(destResponse)) {
    throw new AbortedError(
      `[ResponseTransform]: Destination Response Invalid, for destination: ${destination}`,
      400,
      destResponse,
    );
  }
  const { responseBody, status, payload } = destResponse;
  // validity of responseBody and status
  if (
    !isDefinedAndNotNull(responseBody) ||
    !isDefinedAndNotNull(status) ||
    !_.isNumber(status) ||
    status === 0
  ) {
    throw new AbortedError(
      `[ResponseTransform]: Destination Response Body and(or) Status Invalid, for destination: ${destination}`,
      400,
      destResponse,
    );
  }
  let parsedDestResponseBody;
  try {
    parsedDestResponseBody = JSON.parse(responseBody);
  } catch (err) {
    parsedDestResponseBody = !isEmpty(responseBody) ? responseBody : '';
  }
  return {
    responseBody: parsedDestResponseBody,
    status,
    payload,
  };
};

// Function to process wrapped axios response from internal http client compatible for response handlers
const processAxiosResponse = (clientResponse) => {
  if (!clientResponse.success) {
    const { response, code } = clientResponse.response;
    // node internal http client failure cases
    if (!response && code) {
      const nodeClientError = nodeSysErrorToStatus(code);
      return {
        response: nodeClientError.message,
        status: nodeClientError.status,
      };
    }
    // non 2xx status handling for axios response
    if (response) {
      const { data, status } = response;
      return {
        response: data || '',
        status: status || 500,
      };
    }
    // (edge case) response and code is not present
    return {
      response: '',
      status: 500,
    };
  }
  // success(2xx) axios response
  const { data, status } = clientResponse.response;
  return {
    response: data || '',
    status: status || 500,
  };
};

module.exports = {
  nodeSysErrorToStatus,
  getDynamicErrorType,
  parseDestResponse,
  processAxiosResponse,
};
