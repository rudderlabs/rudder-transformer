/* eslint-disable max-classes-per-file */
const util = require('util');
const logger = require('../logger');
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
    'Unplanned-Event': 0,
    'Additional-Properties': 0,
    'Datatype-Mismatch': 0,
    'Required-Missing': 0,
    'Unknown-Violation': 0,
  };

  validationErrors.forEach((error) => {
    vTags[error.type] += 1;
  });

  Object.entries(vTags).forEach(([key, value]) => {
    if (value > 0) {
      stats.counter('hv_metrics', value, { ...metaTags, dropped, violationType: key });
    }
  });


  stats.counter('hv_metrics', validationErrors.length, {
    ...metaTags,
    dropped,
    violationType: 'Total',
  });
};

function processInfo() {
  return {
    pid: process.pid,
    ppid: process.ppid,
    mem: process.memoryUsage(),
    cpu: process.cpuUsage(),
    cmd: `${process.argv0} ${process.argv.join(' ')}`,
  };
}

function logProcessInfo() {
  logger.error(`Process info: `, util.inspect(processInfo(), false, null, true));
}

module.exports = {
  RespStatusError,
  RetryRequestError,
  responseStatusHandler,
  sendViolationMetrics,
  logProcessInfo,
};
