/* eslint-disable eqeqeq */
const get = require("get-value");
const { TRANSFORMER_METRIC } = require("../../v0/util/constant");

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

const trimResponse = response => {
  return {
    code: get(response, "response.code"),
    status: get(response, "response.status"),
    statusText: get(response, "response.statusText"),
    headers: get(response, "response.headers"),
    data: get(response, "response.data"),
    success: get(response, "suceess")
  };
};

// Returns dynamic Meta based on Status Code as Input
const getDynamicMeta = statusCode => {
  if (statusCode == 500) {
    return TRANSFORMER_METRIC.MEASUREMENT_TYPE.API.META.RETRYABLE;
  }
  if (statusCode == 429) {
    return TRANSFORMER_METRIC.MEASUREMENT_TYPE.API.META.THROTTLED;
  }
  return TRANSFORMER_METRIC.MEASUREMENT_TYPE.API.META.ABORTABLE;
};

module.exports = { nodeSysErrorToStatus, trimResponse, getDynamicMeta };
