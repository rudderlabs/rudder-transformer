const CryptoJS = require('crypto-js');
const { AbortedError } = require('@rudderstack/integrations-lib');
const { DATA_SERVERS_BASE_ENDPOINTS_MAP } = require('./config');

const getTTLInMin = (ttl) => parseInt(ttl, 10) * 1440;
const getBaseEndpoint = (dataServer) => DATA_SERVERS_BASE_ENDPOINTS_MAP[dataServer];
const getFirstPartyEndpoint = (dataServer) => `${getBaseEndpoint(dataServer)}/data/advertiser`;

/**
 * Generates a signature header for a given request using a secret key.
 *
 * @param {Object} request - The request object to generate the signature for.
 * @param {string} secretKey - The secret key used to generate the signature.
 * @returns {string} - The generated signature header.
 * @throws {AbortedError} - If the secret key is missing.
 */
const getSignatureHeader = (request, secretKey) => {
  if (!secretKey) {
    throw new AbortedError('Secret key is missing. Aborting');
  }
  const sha1 = CryptoJS.HmacSHA1(JSON.stringify(request), secretKey);
  const base = CryptoJS.enc.Base64.stringify(sha1);
  return base;
};

module.exports = {
  getTTLInMin,
  getFirstPartyEndpoint,
  getSignatureHeader,
};
