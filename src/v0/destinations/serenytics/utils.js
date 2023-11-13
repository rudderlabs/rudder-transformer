const { ConfigurationError } = require('@rudderstack/integrations-lib');
const {
  constructPayload,
  extractCustomFields,
  defaultRequestConfig,
  defaultPostRequestConfig,
} = require('../../util');
const { MAPPING_CONFIG } = require('./config');

const checkStorageUrl = (STORAGE_URL, messageType) => {
  if (!STORAGE_URL) {
    throw new ConfigurationError(
      `Storage url for "${messageType.toUpperCase()}" is missing. Aborting!`,
    );
  }
  const regexExp = /[\w#%()+./:=?@~]{2,256}\.[a-z]{1,6}\b([\w#%&+./:=?@~-]*)/;
  if (!regexExp.test(STORAGE_URL)) {
    throw new ConfigurationError(
      `Invalid storage url for "${messageType.toUpperCase()}". Aborting!`,
    );
  }
};

const responseBuilder = (STORAGE_URL, payload) => {
  const response = defaultRequestConfig();
  response.endpoint = STORAGE_URL;
  response.method = defaultPostRequestConfig.requestMethod;
  response.body.JSON = payload;
  return response;
};

const storageUrlResponseBuilder = (storageUrlEventList, payload) => {
  const responseList = [];
  if (storageUrlEventList) {
    storageUrlEventList.forEach((eventUrl) => {
      const response = responseBuilder(eventUrl, payload);
      responseList.push(response);
    });
  }
  return responseList;
};

const payloadBuilder = (message, typeName, extractionList, SERENYTICS_EXCLUSION_LIST) => {
  const payload = constructPayload(message, MAPPING_CONFIG[typeName]);
  let customPayload = {};
  customPayload = extractCustomFields(
    message,
    customPayload,
    extractionList,
    SERENYTICS_EXCLUSION_LIST,
  );
  if (customPayload) {
    if (extractionList.includes('properties')) {
      Object.entries(customPayload).forEach(([key, value]) => {
        payload[`property_${key}`] = value;
      });
    } else {
      Object.entries(customPayload).forEach(([key, value]) => {
        payload[`trait_${key}`] = value;
      });
    }
  }
  return payload;
};

module.exports = {
  payloadBuilder,
  storageUrlResponseBuilder,
  responseBuilder,
  checkStorageUrl,
};
