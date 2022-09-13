/* eslint-disable max-classes-per-file */
class RespStatusError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode || 400;
  }
}

class RetryRequestError extends RespStatusError {
  constructor(message) {
    super(message, 809);
  }
}

const transformerStatusHandler = (status, entity, versionId, url) => {
  if (status >= 500) {
    throw new RetryRequestError(
      `Error occurred while fetching ${entity} with version id ${versionId}`
    );
  } else if (status !== 200) {
    throw new RespStatusError(
      `${entity} not found at ${url}?versionId=${versionId}`,
      status
    );
  }
};

module.exports = {
  RespStatusError,
  RetryRequestError,
  transformerStatusHandler
};
