const { ConfigurationError } = require('../../util/errorTypes');

/**
 * Fetches the platform type from the destination Config
 * @param {*} destination
 * @returns platform type used
 */
const fetchPlatform = (destination) => {
  const { cloudMode } = destination.Config;
  if (cloudMode === 'web') {
    return 'pl';
  }
  if (cloudMode === 'server') {
    return 'diapi';
  }
  throw new ConfigurationError('Payload contains invalid configuration');
};

module.exports = { fetchPlatform };
