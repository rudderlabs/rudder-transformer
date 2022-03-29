const btoa = require("btoa");
const { EventType } = require("../../../constants");

const {
  identifyMapping,
  trackMapping,
  groupMapping,
  BASE_URL_EU,
  BASE_URL_US,
  RESERVED_TRAITS_MAPPING
} = require("./config");

const {
  constructPayload,
  getFieldValueFromMessage,
  defaultPostRequestConfig,
  removeUndefinedAndNullValues,
  defaultRequestConfig,
  CustomError,
  flattenJson,
  isDefinedAndNotNullAndNotEmpty
} = require("../../util");

const identifyResponseBuilder = (message, { Config }) => {
  const tagPayload = constructPayload(message, identifyMapping);
  const attributePayload = constructPayload(message, identifyMapping);
  delete attributePayload.audience;
  const { appKey, dataCenter, appSecret } = Config;
  if (!appKey || !appSecret) {
    if (!appKey)
      throw new CustomError(
        "[Airship]:: App Key is required for Authentication",
        400
      );
    else
      throw new CustomError(
        "[Airship]:: App Secet is required for authentication",
        400
      );
  }
  let BASE_URL = BASE_URL_US;
  // check the region and which api end point should be used
  BASE_URL = dataCenter ? BASE_URL_EU : BASE_URL;

  const traits = flattenJson(getFieldValueFromMessage(message, "traits"));
  if (!isDefinedAndNotNullAndNotEmpty(traits)) {
    throw new CustomError(
      "[Airship]:: for identify, tags or attributes properties are required under traits",
      400
    );
  }

  tagPayload.add = { rudderstack_integration: [] };
  tagPayload.remove = { rudderstack_integration: [] };
  let timestamp = getFieldValueFromMessage(message, "timestamp");
  timestamp = new Date(timestamp).toISOString().replace(/\.[0-9]{3}/, "");

  attributePayload.attributes = [];
  Object.keys(traits).forEach(key => {
    if (typeof traits[key] === "boolean") {
      const tag = key.toLowerCase().replace(/\./g, "_");
      if (traits[key] === true) {
        tagPayload.add.rudderstack_integration.push(tag);
      }
      if (traits[key] === false) {
        tagPayload.remove.rudderstack_integration.push(tag);
      }
    }
    if (typeof traits[key] !== "boolean") {
      const attribute = {};
      attribute.action = "set";
      const keyMapped = RESERVED_TRAITS_MAPPING[key.toLowerCase()];
      if (keyMapped) {
        attribute.key = keyMapped;
      } else {
        attribute.key = key.replace(/\./g, "_");
      }
      attribute.value = traits[key];
      attribute.timestamp = timestamp;
      attributePayload.attributes.push(attribute);
    }
  });

  let tagResponse;
  let attributeResponse;
  const arrayPayload = [];
  if (
    tagPayload.add.rudderstack_integration.length ||
    tagPayload.remove.rudderstack_integration.length
  ) {
    if (!tagPayload.add.rudderstack_integration.length) delete tagPayload.add;
    if (!tagPayload.remove.rudderstack_integration.length)
      delete tagPayload.remove;
    tagResponse = defaultRequestConfig();
    tagResponse.endpoint = `${BASE_URL}/api/named_users/tags`;
    tagResponse.headers = {
      "Content-Type": "application/json",
      Accept: "application/vnd.urbanairship+json; version=3",
      Authorization: `Basic ${btoa(`${appKey}:${appSecret}`)}`
    };
    tagResponse.method = defaultPostRequestConfig.requestMethod;
    tagResponse.body.JSON = removeUndefinedAndNullValues(tagPayload);
    arrayPayload.push(tagResponse);
  }
  if (attributePayload.attributes.length) {
    attributeResponse = defaultRequestConfig();
    attributeResponse.endpoint = `${BASE_URL}/api/named_users/${message.userId}/attributes`;
    attributeResponse.headers = {
      "Content-Type": "application/json",
      Accept: "application/vnd.urbanairship+json; version=3",
      Authorization: `Basic ${btoa(`${appKey}:${appSecret}`)}`
    };
    attributeResponse.method = defaultPostRequestConfig.requestMethod;
    attributeResponse.body.JSON = removeUndefinedAndNullValues(
      attributePayload
    );
    arrayPayload.push(attributeResponse);
  }

  return arrayPayload;
};

const trackResponseBuilder = async (message, { Config }) => {
  let name = message.event;
  if (!name) {
    throw new CustomError("event name is required for track", 400);
  }

  name = name.toLowerCase();
  const payload = constructPayload(message, trackMapping);
  payload.name = name.replace(" ", "_");
  if (payload.value) {
    payload.value = message.value.replace(" ", "_");
  }
  const { appKey, dataCenter, apiKey } = Config;
  if (!apiKey || !appKey) {
    if (!appKey)
      throw new CustomError(
        "[Airship] App Key is required for Authentication",
        400
      );
    else
      throw new CustomError(
        "[Airship] Api Key (Bearer Token) is required for authentication",
        400
      );
  }

  let BASE_URL = BASE_URL_US;
  // check the region and which api end point should be used
  BASE_URL = dataCenter ? BASE_URL_EU : BASE_URL;

  const response = defaultRequestConfig();
  const timestamp = getFieldValueFromMessage(message, "timestamp");
  if (timestamp) response.body.JSON.occured = timestamp;
  response.body.JSON.user = {};
  response.body.JSON.user.named_user_id = message.userId;
  response.headers = {
    "Content-Type": "application/json",
    Accept: "application/vnd.urbanairship+json; version=3",
    "X-UA-Appkey": `${appKey}`,
    Authorization: `Bearer ${apiKey}`
  };
  if (message.type === "track") {
    response.endpoint = `${BASE_URL}/api/custom-events`;
  }
  response.method = defaultPostRequestConfig.requestMethod;
  response.body.JSON.body = {};
  response.body.JSON.body = payload;
  return response;
};

const groupResponseBuilder = (message, { Config }) => {
  const tagPayload = constructPayload(message, groupMapping);
  const attributePayload = constructPayload(message, groupMapping);
  delete attributePayload.audience;
  const { appKey, dataCenter, appSecret } = Config;
  if (!appKey || !appSecret) {
    if (!appKey)
      throw new CustomError(
        "[Airship] App Key is required for Authentication",
        400
      );
    else
      throw new CustomError(
        "[Airship] App Secet is required for authentication",
        400
      );
  }

  let BASE_URL = BASE_URL_US;
  // check the region and which api end point should be used
  BASE_URL = dataCenter ? BASE_URL_EU : BASE_URL;

  const traits = flattenJson(getFieldValueFromMessage(message, "traits"));
  if (!isDefinedAndNotNullAndNotEmpty(traits)) {
    throw new CustomError(
      "[Airship]:: for group, tags or attributes properties are required under traits",
      400
    );
  }

  tagPayload.add = { rudderstack_integration_group: [] };
  tagPayload.remove = { rudderstack_integration_group: [] };
  let timestamp = getFieldValueFromMessage(message, "timestamp");
  timestamp = new Date(timestamp).toISOString().replace(/\.[0-9]{3}/, "");
  attributePayload.attributes = [];
  Object.keys(traits).forEach(key => {
    if (typeof traits[key] === "boolean") {
      const tag = key.toLowerCase().replace(/\./g, "_");
      if (traits[key] === true) {
        tagPayload.add.rudderstack_integration_group.push(tag);
      }
      if (traits[key] === false) {
        tagPayload.remove.rudderstack_integration_group.push(tag);
      }
    }
    if (typeof traits[key] !== "boolean") {
      const attribute = {};
      attribute.action = "set";
      const keyMapped = RESERVED_TRAITS_MAPPING[key.toLowerCase()];
      if (keyMapped) {
        attribute.key = keyMapped;
      } else {
        attribute.key = key.replace(/\./g, "_");
      }
      attribute.value = traits[key];
      attribute.timestamp = timestamp;
      attributePayload.attributes.push(attribute);
    }
  });

  let tagResponse;
  let attributeResponse;
  const arrayPayload = [];
  if (
    tagPayload.add.rudderstack_integration_group.length ||
    tagPayload.remove.rudderstack_integration_group.length
  ) {
    if (!tagPayload.add.rudderstack_integration_group.length)
      delete tagPayload.add;
    if (!tagPayload.remove.rudderstack_integration_group.length)
      delete tagPayload.remove;

    tagResponse = defaultRequestConfig();
    tagResponse.endpoint = `${BASE_URL}/api/named_users/tags`;
    tagResponse.headers = {
      "Content-Type": "application/json",
      Accept: "application/vnd.urbanairship+json; version=3",
      Authorization: `Basic ${btoa(`${appKey}:${appSecret}`)}`
    };
    tagResponse.method = defaultPostRequestConfig.requestMethod;
    tagResponse.body.JSON = removeUndefinedAndNullValues(tagPayload);
    arrayPayload.push(tagResponse);
  }
  if (attributePayload.attributes.length) {
    attributeResponse = defaultRequestConfig();
    attributeResponse.endpoint = `${BASE_URL}/api/named_users/${message.userId}/attributes`;
    attributeResponse.headers = {
      "Content-Type": "application/json",
      Accept: "application/vnd.urbanairship+json; version=3",
      Authorization: `Basic ${btoa(`${appKey}:${appSecret}`)}`
    };
    attributeResponse.method = defaultPostRequestConfig.requestMethod;
    attributeResponse.body.JSON = removeUndefinedAndNullValues(
      attributePayload
    );
    arrayPayload.push(attributeResponse);
  }
  return arrayPayload;
};

const process = async event => {
  const { message, destination } = event;
  if (!message.type) {
    throw new CustomError(
      "Message Type is not present. Aborting message.",
      400
    );
  }

  const messageType = message.type.toLowerCase();

  let response;
  switch (messageType) {
    case EventType.IDENTIFY:
      response = await identifyResponseBuilder(message, destination);
      break;
    case EventType.TRACK:
      response = await trackResponseBuilder(message, destination);
      break;
    case EventType.GROUP:
      response = await groupResponseBuilder(message, destination);
      break;
    default:
      throw new CustomError(`message type ${messageType} not supported`, 400);
  }
  return response;
};

module.exports = { process };
