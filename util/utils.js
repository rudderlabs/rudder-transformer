class RespStatusError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode || 400;
  }
}

const transformerStatusHandler = (status, entity, versionId, url) => {
  if (status >= 500) {
    throw new RespStatusError(
      `Error occurred while fetching ${entity} with version id ${versionId}`,
      809
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
  transformerStatusHandler
};
