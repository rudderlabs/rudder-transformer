const {
  nodeSysErrorToStatus
} = require("../../../adapters/utils/networkUtils");
const { CustomError } = require("../../util");

const errorHandler = (err, message) => {
  if (err.response) {
    throw new CustomError(
      `${message} (${err.response?.statusText},${err.response?.data})`,
      err.response.status || 400
    );
  } else {
    const httpError = nodeSysErrorToStatus(err.code);
    throw new CustomError(`${message} ${httpError.message}`, httpError.status);
  }
};

module.exports = { errorHandler };
