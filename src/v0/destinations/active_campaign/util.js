const {
  nodeSysErrorToStatus,
  getDynamicErrorType
} = require("../../../adapters/utils/networkUtils");
const {
  RetryableError,
  NetworkInstrumentationError,
  NetworkError
} = require("../../util/errorTypes");
const tags = require("../../util/tags");

const errorHandler = (err, message) => {
  if (err.response) {
    throw new NetworkError(
      `${message} (${err.response?.statusText},${JSON.stringify(
        err.response?.data
      )})`,
      err.status,
      {
        [tags.TAG_NAMES.ERROR_TYPE]: getDynamicErrorType(err.status)
      },
      err.response.data
    );
  } else {
    const httpError = nodeSysErrorToStatus(err.code);
    if (httpError.status === 500) {
      throw new RetryableError(`${message} ${httpError.message}`);
    }
    throw new NetworkInstrumentationError(`${message} ${httpError.message}`);
  }
};

module.exports = { errorHandler };
