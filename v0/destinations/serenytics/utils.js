const set = require("set-value");
const {
  constructPayload,
  extractCustomFields,
  defaultRequestConfig,
  defaultPostRequestConfig
} = require("../../util");
const { MAPPING_CONFIG } = require("./config");

const responseBuilder = (STORAGE_URL, payload) => {
  const response = defaultRequestConfig();
  response.endpoint = STORAGE_URL;
  response.method = defaultPostRequestConfig.requestMethod;
  response.body.JSON = payload;
  return response;
};

const storageUrlResponseBuilder = (
  STORAGE_URL,
  storageUrlEventList,
  payload
) => {
  const responseList = [];
  storageUrlEventList.forEach(eventUrl => {
    const response = responseBuilder(eventUrl, payload);
    responseList.push(response);
  });
  const response = responseBuilder(STORAGE_URL, payload);
  responseList.push(response);
  return responseList;
};

const payloadBuilder = (
  message,
  typeName,
  EXTRACTION_LIST,
  SERENYTICS_EXCLUSION_LIST
) => {
  const payload = constructPayload(message, MAPPING_CONFIG[typeName]);
  let customPayload = {};
  customPayload = extractCustomFields(
    message,
    customPayload,
    EXTRACTION_LIST,
    SERENYTICS_EXCLUSION_LIST
  );
  if (customPayload) {
    if (EXTRACTION_LIST[0] === "properties") {
      Object.entries(customPayload).forEach(([key, value]) => {
        set(payload, `property_${key}`, value);
      });
    } else {
      Object.entries(customPayload).forEach(([key, value]) => {
        set(payload, `trait_${key}`, value);
      });
    }
  }
  return payload;
};

module.exports = { payloadBuilder, storageUrlResponseBuilder, responseBuilder };
