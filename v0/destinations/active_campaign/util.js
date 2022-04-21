const get = require("get-value");
const {
  nodeSysErrorToStatus
} = require("../../../adapters/utils/networkUtils");
const { CustomError } = require("../../util");

const errorHandler = (err, message) => {
  if (err.response) {
    throw new CustomError(
      `${message} (${get(err, "response.statusText")},${get(
        err,
        "response.data"
      )})`,
      err.response.status || 400
    );
  } else {
    const httpError = nodeSysErrorToStatus(err.code);
    throw new CustomError(`${message} ${httpError.message}`, httpError.status);
  }
};

module.exports = { errorHandler };
