/* eslint-disable max-classes-per-file, @typescript-eslint/return-await */
const http = require('http');
const https = require('https');
const { Resolver } = require('dns').promises;
const fetch = require('node-fetch');
const ipaddr = require('ipaddr.js');
const { AsyncLocalStorage } = require('node:async_hooks');

const util = require('util');
const NodeCache = require('node-cache');
const logger = require('../logger');
const stats = require('./stats');

const resolver = new Resolver();
const dnsCallbackStorage = new AsyncLocalStorage();

const BLOCK_HOST_NAMES = process.env.BLOCK_HOST_NAMES || '';
const BLOCK_HOST_NAMES_LIST = BLOCK_HOST_NAMES.split(',');

// Always-on SSRF denylist: ranges that are never a legitimate outbound target.
// These are blocked regardless of configuration (only ALLOW_IP_RANGES can
// exempt them). Operators block additional ranges
// (e.g. RFC1918 private space, carrier-grade NAT, test-nets) by appending to
// BLOCK_IP_RANGES.
const BLOCKED_CIDRS = [
  '127.0.0.0/8', // IPv4 loopback
  '0.0.0.0/8', // IPv4 unspecified / this-host
  '169.254.0.0/16', // IPv4 link-local (incl. 169.254.169.254 cloud metadata)
  '::1/128', // IPv6 loopback
  '::/128', // IPv6 unspecified
  'fe80::/10', // IPv6 link-local
];

// Parse a comma-separated env var of CIDRs into ipaddr [addr, prefix] pairs.
// Invalid entries are logged and skipped rather than crashing startup.
const parseCidrConfig = (raw) =>
  (raw || '')
    .split(',')
    .map((cidr) => cidr.trim())
    .filter(Boolean)
    .reduce((acc, cidr) => {
      try {
        acc.push(ipaddr.parseCIDR(cidr));
      } catch (error) {
        logger.error(`Ignoring invalid CIDR "${cidr}": ${error.message}`);
      }
      return acc;
    }, []);

// Always-on core plus any operator-configured ranges; BLOCK_IP_RANGES is additive.
const BLOCKED_IP_RANGES = [
  ...parseCidrConfig(BLOCKED_CIDRS.join(',')),
  ...parseCidrConfig(process.env.BLOCK_IP_RANGES),
];
// Exceptions: addresses here are allowed even if they match a blocked range
// (e.g. ALLOW_IP_RANGES=127.0.0.0/8 to permit loopback in a trusted deployment).
const ALLOWED_IP_RANGES = parseCidrConfig(process.env.ALLOW_IP_RANGES);

const matchesAnyCidr = (addr, cidrs) =>
  cidrs.some((cidr) => addr.kind() === cidr[0].kind() && addr.match(cidr));

// SSRF guard. Blocks any address matching the (configured or default) denylist,
// unless it is explicitly permitted via ALLOWED_IP_RANGES. IPv4-mapped IPv6 is
// unwrapped first (so ::ffff:127.0.0.1 is treated as 127.0.0.1) and input that
// cannot be parsed fails closed.
const isBlockedIP = (address) => {
  if (!address) {
    return true;
  }
  let addr;
  try {
    addr = ipaddr.parse(address);
  } catch (error) {
    return true;
  }
  if (addr.kind() === 'ipv6' && addr.isIPv4MappedAddress()) {
    addr = addr.toIPv4Address();
  }
  if (matchesAnyCidr(addr, ALLOWED_IP_RANGES)) {
    return false;
  }
  return matchesAnyCidr(addr, BLOCKED_IP_RANGES);
};
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

const staticLookup =
  (fetchAddress = fetchAddressFromHostName) =>
  (hostname, options, cb) => {
    const resolveStartTime = new Date();
    const onDnsResolved = dnsCallbackStorage.getStore();

    fetchAddress(hostname)
      .then(({ address, cacheHit }) => {
        if (onDnsResolved) {
          onDnsResolved({ resolveStartTime, cacheHit, error: false });
        }

        // Validates the resolved IP of a hostname hop. IP-literal hosts never
        // reach here (net.connect skips lookup for them); those are checked up
        // front in ssrfSafeAgentFactory.
        if (isBlockedIP(address)) {
          cb(new Error(`cannot use ${address || 'empty'} as IP address for ${hostname}`), null);
        } else if (options?.all) {
          cb(null, [{ address, family: RECORD_TYPE_A }]);
        } else {
          cb(null, address, RECORD_TYPE_A);
        }
      })
      .catch((error) => {
        logger.error(`DNS Error Code: ${error.code} | Message : ${error.message}`);
        if (onDnsResolved) {
          onDnsResolved({ resolveStartTime, cacheHit: false, error: true });
        }
        cb(new Error(`unable to resolve IP address for ${hostname}`), null);
      });
  };

const parseEnvInt = (value, defaultValue) => {
  if (!value) return defaultValue;
  const parsed = Number.parseInt(value, 10);
  return Number.isNaN(parsed) ? defaultValue : parsed;
};

const SHARED_HTTP_AGENT_DISABLE_KEEP_ALIVE =
  process.env.SHARED_HTTP_AGENT_DISABLE_KEEP_ALIVE === 'true';
// Socket inactivity timeout. Only starts after a socket is acquired and connected.
// Resets whenever data flows; does not protect against socket pool exhaustion.
const SHARED_HTTP_AGENT_TIMEOUT_MS = parseEnvInt(process.env.SHARED_HTTP_AGENT_TIMEOUT_MS, 60000);
const SHARED_HTTP_AGENT_MAX_SOCKETS = parseEnvInt(process.env.SHARED_HTTP_AGENT_MAX_SOCKETS, 200);
const SHARED_HTTP_AGENT_MAX_FREE_SOCKETS = parseEnvInt(
  process.env.SHARED_HTTP_AGENT_MAX_FREE_SOCKETS,
  10,
);

const sharedAgentOptions = {
  keepAlive: !SHARED_HTTP_AGENT_DISABLE_KEEP_ALIVE,
  timeout: SHARED_HTTP_AGENT_TIMEOUT_MS,
  maxSockets: SHARED_HTTP_AGENT_MAX_SOCKETS,
  maxFreeSockets: SHARED_HTTP_AGENT_MAX_FREE_SOCKETS,
};

const sharedHttpAgentWithLookup = new http.Agent({
  ...sharedAgentOptions,
  lookup: staticLookup(),
});

const sharedHttpsAgentWithLookup = new https.Agent({
  ...sharedAgentOptions,
  lookup: staticLookup(),
});

// Per-hop agent selector. node-fetch calls this for the initial request AND for
// every redirect hop, so it is the SSRF choke point that also sees redirect
// targets.
//
// Why this is needed even though the agents' `lookup` already runs isBlockedIP:
// net.connect only calls `lookup` when the host is a DNS *name* — for a numeric
// IP host there is nothing to resolve, so `lookup` (and the isBlockedIP inside
// it) is skipped entirely. That is exactly how `http://host/redirect?url=
// http://127.0.0.1:9090` slipped through: the redirect target is an IP literal,
// so it never reached `lookup`. (node-fetch did reuse the agent on the redirect
// hop — the literal IP, not the redirect, was the bypass.)
//
// So isBlockedIP is enforced in two complementary places, one check, both host
// forms covered:
//   - IP-literal hosts -> validated here, before connect (initial + every hop)
//   - hostname  hosts  -> deferred to the agents' `lookup`, which resolves then
//                         validates at connect time (covers names + DNS rebinding)
const ssrfSafeAgentFactory = (parsedURL) => {
  // Defense-in-depth. node-fetch already rejects non-http(s) before it calls the
  // agent, so this never fires for real traffic today; it is kept so the egress
  // protocol allowlist is explicit at the choke point and survives an HTTP-client
  // upgrade/swap. Valid http/https requests pass through unaffected.
  if (parsedURL.protocol !== 'http:' && parsedURL.protocol !== 'https:') {
    throw new Error('invalid protocol, only http and https are supported');
  }
  // URL.hostname keeps the brackets around IPv6 literals (e.g. "[::1]") per
  // RFC 3986, but ipaddr rejects bracketed input — ipaddr.isValid("[::1]") is
  // false while ipaddr.isValid("::1") is true. Without stripping, the isValid
  // guard below would skip every IPv6 literal and "[::1]" (loopback) would leak.
  // The anchors peel only the wrapping brackets; it is a no-op for IPv4 and names.
  const host = parsedURL.hostname.replace(/^\[/, '').replace(/]$/, '');
  if (ipaddr.isValid(host) && isBlockedIP(host)) {
    throw new Error(`blocked request to non-public address: ${host}`);
  }
  return parsedURL.protocol === 'https:' ? sharedHttpsAgentWithLookup : sharedHttpAgentWithLookup;
};

// Blocks operator-denylisted hostnames (BLOCK_HOST_NAMES). Localhost and other
// internal addresses are handled by isBlockedIP (the BLOCKED_CIDRS core) at the
// agent/lookup layer, so they are not special-cased here.
const blockLocalhostRequests = (url) => {
  try {
    const { hostname } = new URL(url);
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
  if (args.length === 0) {
    throw new Error('fetch url is required');
  }
  const fetchURL = args[0].trim();
  blockLocalhostRequests(fetchURL);
  blockInvalidProtocolRequests(fetchURL);
  const fetchOptions = args[1] || {};

  const onDnsResolved = ({ resolveStartTime, cacheHit, error }) => {
    // Destructure to exclude isSuccess which is not part of fetch_dns_resolve_time labelset
    const { isSuccess, ...dnsMetricTags } = transformationTags;
    stats.timing('fetch_dns_resolve_time', resolveStartTime, {
      ...dnsMetricTags,
      ...(error ? { error: 'true' } : { cacheHit }),
    });
  };

  fetchOptions.agent = ssrfSafeAgentFactory;
  return dnsCallbackStorage.run(onDnsResolved, () => fetch(fetchURL, fetchOptions));
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

/**
 * Utility function to check if dynamic config processing should be skipped
 * based on the hasDynamicConfig flag.
 *
 * @param destination - The destination object containing the hasDynamicConfig flag
 * @returns true if processing should be skipped, false otherwise
 */
function shouldSkipDynamicConfigProcessing(destination) {
  // Only skip processing if hasDynamicConfig is explicitly false
  return destination?.hasDynamicConfig === false;
}

/**
 * Utility function to check if events should be grouped by destination config
 * based on the hasDynamicConfig flag.
 *
 * @param destination - The destination object containing the hasDynamicConfig flag
 * @returns true if events should be grouped by destination config, false otherwise
 */
function shouldGroupByDestinationConfig(destination) {
  // If undefined (older server versions), process all events as if they might have dynamic config
  // Only skip grouping by config if the flag is explicitly false
  return destination?.hasDynamicConfig !== false;
}

function validateIp(ip) {
  if (!ip) {
    throw new Error('ip address is required');
  }
  if (!ipaddr.isValid(ip)) {
    throw new Error('invalid ip address');
  }
}

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
  ssrfSafeAgentFactory,
  isBlockedIP,
  staticLookup,
  dnsCallbackStorage,
  shouldSkipDynamicConfigProcessing,
  shouldGroupByDestinationConfig,
  validateIp,
};
