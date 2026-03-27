const ipaddr = require('ipaddr.js');

/**
 * Validates an IP address argument for use in the geolocation API path.
 * Uses ipaddr.js for consistency with the geolocation service.
 * Throws if the IP is missing or invalid.
 */
function validateGeolocationIp(ip) {
  if (!ip) {
    throw new Error('ip address is required');
  }
  if (!ipaddr.isValid(ip)) {
    throw new Error('invalid ip address');
  }
}

module.exports = { validateGeolocationIp };
