const { ConfigurationError } = require('@rudderstack/integrations-lib');
const { base64Convertor, applyCustomMappings } = require('../../../../v0/util');

const getAuthHeaders = (config) => {
  let headers;
  switch (config.auth) {
    case 'basicAuth':
      headers = {
        Authorization: `Basic ${base64Convertor(`${config.username}:${config.password}`)}`,
      };
      break;
    case 'bearerTokenAuth':
      headers = { Authorization: `Bearer ${config.bearerToken}` };
      break;
    case 'apiKeyAuth':
      headers = { [config.apiKeyName]: `${config.apiKeyValue}` };
      break;
    default:
      headers = {};
  }
  return headers;
};

const getCustomMappings = (message, mapping) => {
  try {
    return applyCustomMappings(message, mapping);
  } catch (e) {
    throw new ConfigurationError(`[Webhook]:: Error in custom mappings: ${e.message}`);
  }
};

// TODO: write a func to evaluate json path template
const addPathParams = (message, webhookUrl) => webhookUrl;

const excludeMappedFields = (message, mapping) => {
  const payload = message;
  mapping.forEach((field) => {
    delete payload[field];
  });
  return message;
};

module.exports = { getAuthHeaders, getCustomMappings, addPathParams, excludeMappedFields };
