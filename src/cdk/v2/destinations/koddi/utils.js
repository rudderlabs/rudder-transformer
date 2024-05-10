const config = require('./config');
const { constructPayload, defaultRequestConfig } = require('../../../../v0/util');

/**
 *
 * @param message
 * @param Config
 * @returns {{}}
 */
const constructFullPayload = (message, Config) => {
  let payload;
  switch (message.event) {
    case 'Impressions':
      payload = constructPayload(
        message,
        config.mappingConfig[config.ConfigCategories.IMPRESSIONS.name],
      );
      payload.clientName = Config.clientName;
      break;
    case 'Clicks':
      payload = constructPayload(
        message,
        config.mappingConfig[config.ConfigCategories.CLICKS.name],
      );
      payload.clientName = Config.clientName;
      if (Config.testVersionOverride === false) {
        payload.properties.test_version_override = null;
      }
      if (Config.overrides === false) {
        payload.properties.overrides = null;
      }
      break;
    case 'Conversions':
      payload = constructPayload(
        message,
        config.mappingConfig[config.ConfigCategories.CONVERSIONS.name],
      );
      payload.client_name = Config.clientName;
      break;
    default:
      break;
  }
  return payload;
};

const getEndpoint = (Config, message) => {
  let endpoint = Config.apiBaseUrl;
  switch (message.event) {
    case 'Impressions':
      endpoint += '?action=impression';
      break;
    case 'Clicks':
      endpoint += '?action=click';
      break;
    case 'Conversions':
      endpoint += '/conversion';
      break;
    default:
      break;
  }
  return endpoint;
};

const constructResponse = (payload, Config, message) => {
  const response = defaultRequestConfig();
  response.endpoint = getEndpoint(Config, message);
  response.headers = {
    accept: 'application/json',
  };
  if (message.event === 'Conversions') {
    response.body.JSON = payload;
    response.method = 'POST';
    response.headers = {
      ...response.headers,
      'content-type': 'application/json',
    };
  } else {
    response.params = payload;
    response.method = 'GET';
  }
  return response;
};

module.exports = { constructFullPayload, getEndpoint, constructResponse };
