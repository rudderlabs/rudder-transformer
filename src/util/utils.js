/* eslint-disable max-classes-per-file */
const http = require("http");
const https = require("https");
const { Resolver } = require("dns").promises;

const util = require('util');
const logger = require('../logger');
const stats = require('./stats');

const resolver = new Resolver();
// Cloudflare and Google dns
resolver.setServers([
  "1.1.1.1",
  "8.8.8.8",
]);

const LOCALHOST_IP = "127.0.0.1";
const LOCALHOST_URL = `http://localhost`;

const staticLookup = () => async (hostname, _, cb) => {
  console.log("staticLookup", hostname);

  let ips;
  try {
    ips = await resolver.resolve(hostname);
  } catch (error) {
    cb(null, `unable to resolve IP address for ${hostname}`, 4)
    return;
  }

  console.log("Resolved", hostname, "to", ips);

  if (ips.length === 0) {
    // throw new Error(`Unable to resolve ${hostname}`);
    cb(null, `resolved empty list of IP address for ${hostname}`, 4)
    return;
  }

  for (const ip of ips) {
    if (ip.includes(LOCALHOST_IP)) {
      cb(null, `cannot use ${LOCALHOST_IP} as IP address`, 4)
      return;
    }
  }

  cb(null, ips[0], 4);
};

const staticDnsAgent = (scheme) => {
  const httpModule = scheme === "http" ? http : https;
  return new httpModule.Agent({ lookup: staticLookup() });
};

const blockLocalhostRequests = (url) => {
  if (url?.includes(LOCALHOST_URL) || url?.includes(LOCALHOST_IP)) {
    throw new Error("Localhost requests are not allowed");
  }
};

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

const getIntegrationVersion = () => 'v0';
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

const constructValidationErrors = (validationErrors) =>
  validationErrors.reduce((acc, elem) => {
    if (!acc[elem.type]) {
      acc[elem.type] = [];
    }
    const validationObject = {};
    if (elem.property) {
      validationObject.property = elem.property;
    }
    if (elem.message) {
      validationObject.message = elem.message;
    }
    if (elem.meta?.schemaPath) {
      validationObject.schemaPath = elem.meta.schemaPath;
    }
    acc[elem.type].push(validationObject);
    return acc;
  }, {});

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
  getIntegrationVersion,
  constructValidationErrors,
  sendViolationMetrics,
  logProcessInfo,
  blockLocalhostRequests,
  staticDnsAgent,
};
