const {
  constructPayload,
  extractCustomFields,
  defaultRequestConfig,
  defaultPostRequestConfig,
  CustomError
} = require("../../util");
const { MAPPING_CONFIG } = require("./config");

const checkStorageUrl = (STORAGE_URL, messageType) => {
  if (!STORAGE_URL) {
    throw new CustomError(
      `Storage url for "${messageType.toUpperCase()}" is missing. Aborting!`,
      400
    );
  }
  const regexExp = /[(http(s)?):\/\/(www\.)?a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{1,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/;
  if (!regexExp.test(STORAGE_URL)) {
    throw new CustomError(
      `Invalid storage url for "${messageType.toUpperCase()}". Aborting!`,
      400
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

const storageUrlResponseBuilder = (storageUrlEventList, payload, event) => {
  const responseList = [];
  if (storageUrlEventList) {
    storageUrlEventList.forEach(eventUrl => {
      const response = responseBuilder(eventUrl, payload);
      responseList.push(response);
    });
  }
  return responseList;
};

const payloadBuilder = (
  message,
  typeName,
  extractionList,
  SERENYTICS_EXCLUSION_LIST
) => {
  const payload = constructPayload(message, MAPPING_CONFIG[typeName]);
  let customPayload = {};
  customPayload = extractCustomFields(
    message,
    customPayload,
    extractionList,
    SERENYTICS_EXCLUSION_LIST
  );
  if (customPayload) {
    if (extractionList.includes("properties")) {
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
  checkStorageUrl
};
