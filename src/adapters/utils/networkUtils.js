/* eslint-disable eqeqeq */
const lodash = require('lodash');
const { isEmpty } = require('lodash');
const { AbortedError } = require('@rudderstack/integrations-lib');
const {
  isHttpStatusRetryable,
  isDefinedAndNotNullAndNotEmpty,
  isNonFuncObject,
  isDefinedAndNotNull,
  isHttpStatusSuccess,
  getErrorStatusCode,
} = require('../../v0/util');
const tags = require('../../v0/util/tags');
const { HTTP_STATUS_CODES } = require('../../v0/util/constant');

// Status for a request with no HTTP response: 500 retries, 400 aborts.
// Shared by every lookup and delivery handler: grep for callers that branch on a status before changing one.
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
    EADDRNOTAVAIL: {
      status: 500,
      message: '[EADDRNOTAVAIL] :: Address not available',
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
      status: 500,
      message: '[EMFILE] :: Too many open files in system',
    },
    ENFILE: {
      status: 500,
      message: '[ENFILE] :: File table overflow',
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
    EHOSTUNREACH: {
      status: 500,
      message: '[EHOSTUNREACH] :: Host is unreachable',
    },
    ENETUNREACH: {
      status: 500,
      message: '[ENETUNREACH] :: Network is unreachable',
    },
    ENETDOWN: {
      status: 500,
      message: '[ENETDOWN] :: Network is down',
    },
    EPERM: {
      status: 400,
      message: '[EPERM] :: Operation not permitted',
    },
    EPIPE: {
      status: 500,
      message: '[EPIPE] :: Broken pipe',
    },
    ETIMEDOUT: {
      status: 500,
      message: '[ETIMEDOUT] :: Operation timed out',
    },
    EAI_AGAIN: {
      status: 500,
      message: '[EAI_AGAIN] :: Temporary failure in name resolution',
    },
    ECONNABORTED: {
      status: 500,
      message: '[ECONNABORTED] :: Connection aborted',
    },
  };
  return sysErrorToStatusMap[code] || { status: 400, message: `[${code}]` };
};

// Returns dynamic Meta based on Status Code as Input
const getDynamicErrorType = (statusCode) => {
  if (isHttpStatusRetryable(statusCode)) {
    return tags.ERROR_TYPES.RETRYABLE;
  }
  if (statusCode === 429) {
    return tags.ERROR_TYPES.THROTTLED;
  }
  return tags.ERROR_TYPES.ABORTED;
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
    !lodash.isNumber(status) ||
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
      const { data, status, headers } = response;
      return {
        response: data || '',
        status: status || 500,
        ...(isDefinedAndNotNullAndNotEmpty(headers) ? { headers } : {}),
      };
    }
    // (edge case) response and code is not present
    return {
      response: clientResponse?.response?.data || '',
      status: getErrorStatusCode(clientResponse, HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR),
    };
  }
  // success(2xx) axios response
  const { data, status, headers } = clientResponse.response;
  return {
    response: data || '',
    status: status || 500,
    ...(isDefinedAndNotNullAndNotEmpty(headers) ? { headers } : {}),
  };
};

function getCompatibleStatusCode(status) {
  if (status === HTTP_STATUS_CODES.NOT_FOUND) {
    return HTTP_STATUS_CODES.BAD_REQUEST;
  }
  if (isHttpStatusSuccess(status)) {
    return HTTP_STATUS_CODES.OK;
  }
  return status;
}

module.exports = {
  nodeSysErrorToStatus,
  getDynamicErrorType,
  parseDestResponse,
  processAxiosResponse,
  getCompatibleStatusCode,
};
