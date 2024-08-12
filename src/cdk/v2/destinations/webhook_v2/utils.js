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

const excludeMappedFields = (payload, mapping) => {
  const rawPayload = { ...payload };
  mapping.forEach(({ from }) => {
    // Remove the '$.' prefix and split the remaining string by '.'
    const keys = from.replace(/^\$\./, '').split('.');
    let current = rawPayload;

    // Traverse to the parent of the key to be removed
    keys.slice(0, -1).forEach((key) => {
      if (current && current[key]) {
        current = current[key];
      } else {
        current = null;
      }
    });

    if (current) {
      // Remove the 'from' field from input payload
      delete current[keys[keys.length - 1]];
    }
  });

  return rawPayload;
};

module.exports = { getAuthHeaders, getCustomMappings, addPathParams, excludeMappedFields };
