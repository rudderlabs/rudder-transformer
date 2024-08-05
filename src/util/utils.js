/* eslint-disable max-classes-per-file, @typescript-eslint/return-await */
const http = require('http');
const https = require('https');
const { Resolver } = require('dns').promises;
const fetch = require('node-fetch');

const util = require('util');
const NodeCache = require('node-cache');
const logger = require('../logger');
const stats = require('./stats');

const resolver = new Resolver();

const BLOCK_HOST_NAMES = process.env.BLOCK_HOST_NAMES || '';
const BLOCK_HOST_NAMES_LIST = BLOCK_HOST_NAMES.split(',');
const LOCAL_HOST_NAMES_LIST = ['localhost', '127.0.0.1', '[::]', '[::1]'];
const LOCALHOST_OCTET = '127.';
const RECORD_TYPE_A = 4; // ipv4
const DNS_CACHE_ENABLED = process.env.DNS_CACHE_ENABLED === 'true';
const DNS_CACHE_TTL = process.env.DNS_CACHE_TTL ? parseInt(process.env.DNS_CACHE_TTL, 10) : 300;
const dnsCache = new NodeCache({
  useClones: false,
  stdTTL: DNS_CACHE_TTL,
  checkperiod: DNS_CACHE_TTL,
});

const resolveHostName = async (hostname) => {
  // ex: [{ address: '108.157.0.0', ttl: 600 }]
  const addresses = await resolver.resolve4(hostname, { ttl: true });
  return addresses.length > 0 ? addresses[0] : {};
};

const fetchAddressFromHostName = async (hostname) => {
  if (!DNS_CACHE_ENABLED) {
    const { address } = await resolveHostName(hostname);
    return { address, cacheHit: false };
  }
  const cachedAddress = dnsCache.get(hostname);
  if (cachedAddress !== undefined) {
    return { address: cachedAddress, cacheHit: true };
  }
  const { address, ttl } = await resolveHostName(hostname);
  dnsCache.set(hostname, address, Math.min(ttl, DNS_CACHE_TTL));
  return { address, cacheHit: false };
};

const staticLookup = (transformationTags) => async (hostname, _, cb) => {
  let ip;
  const resolveStartTime = new Date();
  try {
    const { address, cacheHit } = await fetchAddressFromHostName(hostname);
    ip = address;
    stats.timing('fetch_dns_resolve_time', resolveStartTime, { ...transformationTags, cacheHit });
  } catch (error) {
    logger.error(`DNS Error Code: ${error.code} | Message : ${error.message}`);
    stats.timing('fetch_dns_resolve_time', resolveStartTime, {
      ...transformationTags,
      error: 'true',
    });
    cb(null, `unable to resolve IP address for ${hostname}`, RECORD_TYPE_A);
    return;
  }

  if (!ip) {
    cb(null, `resolved empty list of IP address for ${hostname}`, RECORD_TYPE_A);
    return;
  }

  if (ip.startsWith(LOCALHOST_OCTET)) {
    cb(null, `cannot use ${ip} as IP address`, RECORD_TYPE_A);
    return;
  }

  cb(null, ip, RECORD_TYPE_A);
};

const httpAgentWithDnsLookup = (scheme, transformationTags) => {
  const httpModule = scheme === 'http' ? http : https;
  return new httpModule.Agent({ lookup: staticLookup(transformationTags) });
};

const blockLocalhostRequests = (url) => {
  try {
    const parseUrl = new URL(url);
    const { hostname } = parseUrl;
    if (LOCAL_HOST_NAMES_LIST.includes(hostname) || hostname.startsWith(LOCALHOST_OCTET)) {
      throw new Error('localhost requests are not allowed');
    }
    if (BLOCK_HOST_NAMES_LIST.includes(hostname)) {
      throw new Error('blocked host requests are not allowed');
    }
  } catch (error) {
    throw new Error(`invalid url, ${error.message}`);
  }
};

const blockInvalidProtocolRequests = (url) => {
  if (!(url.startsWith('https') || url.startsWith('http'))) {
    throw new Error(`invalid protocol, only http and https are supported`);
  }
};

const fetchWithDnsWrapper = async (transformationTags, ...args) => {
  if (process.env.DNS_RESOLVE_FETCH_HOST !== 'true') {
    return await fetch(...args);
  }

  if (args.length === 0) {
    throw new Error('fetch url is required');
  }
  const fetchURL = args[0].trim();
  blockLocalhostRequests(fetchURL);
  blockInvalidProtocolRequests(fetchURL);
  const fetchOptions = args[1] || {};
  const schemeName = fetchURL.startsWith('https') ? 'https' : 'http';
  // assign resolved agent to fetch
  fetchOptions.agent = httpAgentWithDnsLookup(schemeName, transformationTags);
  return await fetch(fetchURL, fetchOptions);
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
  const inspectedInfo = util.inspect(processInfo(), false, Infinity, true);
  logger.error(`Process info: ${inspectedInfo}`);
}

// stringLiterals expected to be an array of strings. A line in trace should contain
// atleast one string in the stringLiterals array for lastMatchingIndex to be updated appropriately.
const extractStackTraceUptoLastSubstringMatch = (trace, stringLiterals) => {
  const traceLines = trace.split('\n');
  let lastRelevantIndex = 0;

  for (let i = traceLines.length - 1; i >= 0; i -= 1) {
    if (stringLiterals.some((str) => traceLines[i].includes(str))) {
      lastRelevantIndex = i;
      break;
    }
  }

  return traceLines.slice(0, lastRelevantIndex + 1).join('\n');
};

module.exports = {
  RespStatusError,
  RetryRequestError,
  responseStatusHandler,
  getIntegrationVersion,
  constructValidationErrors,
  sendViolationMetrics,
  logProcessInfo,
  extractStackTraceUptoLastSubstringMatch,
  fetchWithDnsWrapper,
};
