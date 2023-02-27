/* eslint-disable max-classes-per-file */
const { violationTypes } = require("./eventValidation");
const stats = require('./stats');

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
    throw new RetryRequestError(`Error occurred while fetching ${entity} :: ${id}`);
  } else if (status !== 200) {
    throw new RespStatusError(`${entity} not found at ${url}`, status);
  }
};

const sendViolationMetrics = (validationErrors, dropped, metaTags) => {
  const vTags = {
    "Unplanned-Event": 0,
    "Additional-Properties": 0,
    "Datatype-Mismatch": 0,
    "Required-Missing": 0,
    "Unknown-Violation": 0,
  };
  
  validationErrors.forEach(error => {
    switch (error.type) {
      case violationTypes.UnplannedEvent:
        vTags[violationTypes.UnplannedEvent] += 1;
        break;
      case violationTypes.AdditionalProperties:
        vTags[violationTypes.AdditionalProperties] += 1;
        break;
      case violationTypes.DatatypeMismatch:
        vTags[violationTypes.DatatypeMismatch] += 1;
        break;
      case violationTypes.RequiredMissing:
        vTags[violationTypes.RequiredMissing] += 1;
        break;
      case violationTypes.UnknownViolation:
        vTags[violationTypes.UnknownViolation] += 1;
        break;
      default:
        break;
    }
  });
  
  Object.entries(vTags).forEach(([key, value]) => {
    if (value > 0) {
      stats.gauge('hv_metrics', value, { ...metaTags, dropped, violationType: key });
    }
  });
}

module.exports = {
  RespStatusError,
  RetryRequestError,
  responseStatusHandler,
  sendViolationMetrics,
};
