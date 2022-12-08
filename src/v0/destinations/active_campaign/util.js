const {
  nodeSysErrorToStatus
} = require("../../../adapters/utils/networkUtils");
const {
  RetryableError,
  NetworkInstrumentationError
} = require("../../util/errorTypes");

const errorHandler = (err, message) => {
  if (err.response) {
    throw new NetworkInstrumentationError(
      `${message} (${err.response?.statusText},${JSON.stringify(
        err.response?.data
      )})`
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
