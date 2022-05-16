const { isObject } = require("lodash");
const {
  nodeSysErrorToStatus
} = require("../../../adapters/utils/networkUtils");
const { CustomError } = require("../../util");

const errorHandler = (error, message, reason, code) => {
  if (error.response) {
    if (isObject(reason)) {
      // eslint-disable-next-line no-param-reassign
      reason = JSON.stringify(reason);
    }
    throw new CustomError(`${message} ${reason}`, code);
  } else {
    const httpError = nodeSysErrorToStatus(error.code);
    throw new CustomError(`${message} ${httpError.message}`, httpError.status);
  }
};

module.exports = { errorHandler };
