/* eslint-disable eqeqeq */
const _ = require("lodash");
const { isEmpty } = require("lodash");
const {
  isHttpStatusRetryable,
  isDefinedAndNotNullAndNotEmpty,
  isNonFuncObject,
  isDefinedAndNotNull
} = require("../../v0/util");
const { TRANSFORMER_METRIC } = require("../../v0/util/constant");
const ErrorBuilder = require("../../v0/util/error");

const nodeSysErrorToStatus = code => {
  const sysErrorToStatusMap = {
    EACCES: {
      status: 400,
      message: "[EACCES] :: Permission denied"
    },
    EADDRINUSE: {
      status: 400,
      message: "[EADDRINUSE] :: Address already in use"
    },
    ECONNREFUSED: {
      status: 500,
      message: "[ECONNREFUSED] :: Connection refused"
    },
    ECONNRESET: {
      status: 500,
      message: "[ECONNRESET] :: Connection reset by peer"
    },
    EEXIST: {
      status: 400,
      message: "[EEXIST] :: File exists"
    },
    EISDIR: {
      status: 400,
      message: "[EEXIST] :: Is a directory"
    },
    EMFILE: {
      status: 400,
      message: "[EMFILE] :: Too many open files in system"
    },
    ENOENT: {
      status: 400,
      message: "[ENOENT] :: No such file or directory"
    },
    ENOTDIR: {
      status: 400,
      message: "[ENOTDIR] :: Not a directory"
    },
    ENOTEMPTY: {
      status: 400,
      message: "[ENOTEMPTY] :: Directory not empty)"
    },
    ENOTFOUND: {
      status: 400,
      message: "[ENOTFOUND] :: DNS lookup failed"
    },
    EPERM: {
      status: 400,
      message: "[EPERM] :: Operation not permitted"
    },
    EPIPE: {
      status: 400,
      message: "[EPIPE] :: Broken pipe"
    },
    ETIMEDOUT: {
      status: 500,
      message: "[ETIMEDOUT] :: Operation timed out"
    }
  };
  return sysErrorToStatusMap[code] || { status: 400, message: `[${code}]` };
};

// Returns dynamic Meta based on Status Code as Input
const getDynamicMeta = statusCode => {
  if (isHttpStatusRetryable(statusCode)) {
    return TRANSFORMER_METRIC.MEASUREMENT_TYPE.API.META.RETRYABLE;
  }
  switch (statusCode) {
    case 429:
      return TRANSFORMER_METRIC.MEASUREMENT_TYPE.API.META.THROTTLED;
    default:
      return TRANSFORMER_METRIC.MEASUREMENT_TYPE.API.META.ABORTABLE;
  }
};

const parseDestResponse = (destResponse, destination) => {
  const statTags = {
    destination,
    stage: TRANSFORMER_METRIC.TRANSFORMER_STAGE.RESPONSE_TRANSFORM,
    scope: TRANSFORMER_METRIC.MEASUREMENT_TYPE.EXCEPTION.SCOPE
  };
  // validity of destResponse
  if (
    !isDefinedAndNotNullAndNotEmpty(destResponse) ||
    !isNonFuncObject(destResponse)
  ) {
    throw new ErrorBuilder()
      .setStatus(400)
      .setMessage(
        `[ResponseTransform]: Destination Response Invalid, for destination: ${destination}`
      )
      .setDestinationResponse(destResponse)
      .setStatTags(statTags)
      .build();
  }
  const { responseBody, status } = destResponse;
  // validity of responseBody and status
  if (
    !isDefinedAndNotNull(responseBody) ||
    !isDefinedAndNotNull(status) ||
    !_.isNumber(status) ||
    status === 0
  ) {
    throw new ErrorBuilder()
      .setStatus(400)
      .setMessage(
        `[ResponseTransform]: Destination Response Body and(or) Status Inavlid, for destination: ${destination}`
      )
      .setDestinationResponse(destResponse)
      .setStatTags(statTags)
      .build();
  }
  let parsedDestResponseBody;
  try {
    parsedDestResponseBody = JSON.parse(responseBody);
  } catch (err) {
    parsedDestResponseBody = !isEmpty(responseBody) ? responseBody : "";
  }
  return {
    responseBody: parsedDestResponseBody,
    status,
    payload: destResponse.payload
  };
};

// Function to process wrapped axios response from internal http client compatible for response handlers
const processAxiosResponse = clientResponse => {
  if (!clientResponse.success) {
    const { response, code } = clientResponse.response;
    // node internal http client failure cases
    if (!response && code) {
      const nodeClientError = nodeSysErrorToStatus(code);
      return {
        response: nodeClientError.message,
        status: nodeClientError.status
      };
    }
    // non 2xx status handling for axios response
    if (response) {
      const { data, status } = response;
      return {
        response: data || "",
        status: status || 500
      };
    }
    // (edge case) response and code is not present
    return {
      response: "",
      status: 500
    };
  }
  // success(2xx) axios response
  const { data, status } = clientResponse.response;
  return {
    response: data || "",
    status: status || 500
  };
};

module.exports = {
  nodeSysErrorToStatus,
  getDynamicMeta,
  parseDestResponse,
  processAxiosResponse
};
