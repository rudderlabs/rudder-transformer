const { ConfigurationError } = require('../../util/errorTypes');

/**
 * Get source name from config or return 'Rudder' as default source name
 * @param {*} config
 * @returns
 */
const getSourceName = (config) => {
  const { sourceName } = config;
  if (sourceName?.trim()?.toLowerCase() === 'zendesk') {
    throw new ConfigurationError('Invalid source name. The source name `zendesk` is not allowed.');
  }
  return sourceName || 'Rudder';
};

module.exports = { getSourceName };
