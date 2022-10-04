/* eslint-disable max-classes-per-file */
class RespStatusError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode || 400;
  }
}

class RetryRequestError extends RespStatusError {
  constructor(message) {
    // chosen random unique status code 809 to mark requests that needs to be retried
    super(message, 809);
  }
}

const responseStatusHandler = (status, entity, id, url) => {
  if (status >= 500) {
    throw new RetryRequestError(
      `Error occurred while fetching ${entity} :: ${id}`
    );
  } else if (status !== 200) {
    throw new RespStatusError(`${entity} not found at ${url}`, status);
  }
};

const EC2MetadataURL = "169.254.169.254";

const rejectInternalAccess = (url) => {
  if (url?.includes(EC2MetadataURL)) {
    throw new Error("Internal access is not allowed");
  }
};

module.exports = {
  RespStatusError,
  RetryRequestError,
  responseStatusHandler,
  rejectInternalAccess,
};
