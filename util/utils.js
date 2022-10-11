/* eslint-disable max-classes-per-file */

const { flatten } = require("flat");

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

const compareObjects = (obj1, obj2) => {
  const flatObj1 = flatten(obj1);
  const flatObj2 = flatten(obj2);
  const allKeys = new Set(Object.keys(flatObj1).contact(Object.keys(flatObj2)));
  for (const key of allKeys) {
    
  }
};

module.exports = {
  RespStatusError,
  RetryRequestError,
  responseStatusHandler,
  compareObjects
};
