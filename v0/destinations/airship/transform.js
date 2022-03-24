const btoa = require("btoa");
const set = require("set-value");
const { EventType } = require("../../../constants");

const {
  identifyMapping,
  trackMapping,
  groupMapping,
  BASE_URL_EU,
  BASE_URL_US
} = require("./config");

const {
  constructPayload,
  getFieldValueFromMessage,
  defaultPostRequestConfig,
  removeUndefinedAndNullValues,
  defaultRequestConfig,
  CustomError,
  flattenJson
} = require("../../util");

//-----------------------------------------------------------------------------------------

const identifyResponseBuilder = (message, { Config }) => {
  //   let channel =
  //     getDestinationExternalID(message, "delightedChannelType") || Config.channel;
  //   channel = channel.toLowerCase();
  //   const { userIdType, userIdValue } = isValidUserIdOrError(channel, userId);
  const payload = constructPayload(message, identifyMapping);
  const { appKey, dataCenter, appSecret } = Config;

  let BASE_URL = BASE_URL_US;
  // check the region and which api end point should be used
  if (dataCenter) {
    BASE_URL = BASE_URL_EU;
  }
  const response = defaultRequestConfig();
  // changegetFieldValueMessage
  const traits = flattenJson(getFieldValueFromMessage(message, "traits"));
  if (typeof Object.values(traits)[0] === "boolean") {
    payload.add = { rudderstack_integration: [] };
    payload.remove = { rudderstack_integration: [] };
    Object.keys(traits).forEach(key => {
      if (typeof traits[key] === "boolean") {
        response.endpoint = `${BASE_URL}/api/named_users/tags`;
        //   set(payload, "audience.named_user_id", "payload.named_user_id");
        if (traits[key] === true) {
          payload.add.rudderstack_integration.push(key);
        }
        if (traits[key] === false) {
          payload.remove.rudderstack_integration.push(key);
        }
      }
    });
  } else {
    const timestamp = getFieldValueFromMessage(message, "timestamp");
    payload.attributes = [];
    Object.keys(traits).forEach(key => {
      if (typeof traits[key] !== "boolean") {
        response.endpoint = `${BASE_URL}/api/named_users/${payload.named_user_id}/attributes`;
        const attribute = {};
        attribute.set = "set";
        attribute.key = key.replace(/\./g, "_");
        attribute.value = traits[key];
        attribute.timestamp = timestamp;
        payload.attributes.push(attribute);
      }
    });
  }

  response.headers = {
    "Content-Type": "application/json",
    Accept: "application/vnd.urbanairship+json; version=3",
    Authorization: `Basic ${btoa(`${appKey}:${appSecret}`)}`
  };
  response.method = defaultPostRequestConfig.requestMethod;
  response.body.JSON = removeUndefinedAndNullValues(payload);
  return response;
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

  let BASE_URL = BASE_URL_US;
  // check the region and which api end point should be used
  if (dataCenter) {
    BASE_URL = BASE_URL_EU;
  }

  const response = defaultRequestConfig();
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
  response.body.JSON = removeUndefinedAndNullValues(payload);
  return response;
};

const groupResponseBuilder = (message, { Config }) => {
  //   let channel =
  //     getDestinationExternalID(message, "delightedChannelType") || Config.channel;
  //   channel = channel.toLowerCase();
  //   const { userIdType, userIdValue } = isValidUserIdOrError(channel, userId);
  const payload = constructPayload(message, groupMapping);
  const { appKey, dataCenter, appSecret } = Config;

  let BASE_URL = BASE_URL_US;
  // check the region and which api end point should be used
  if (dataCenter) {
    BASE_URL = BASE_URL_EU;
  }
  // changegetFieldValueMessage
  const response = defaultRequestConfig();

  const traits = flattenJson(getFieldValueFromMessage(message, "traits"));
  if (typeof Object.values(traits)[0] === "boolean") {
    payload.add = { rudderstack_integration_group: [] };
    payload.remove = { rudderstack_integration_group: [] };
    Object.keys(traits).forEach(key => {
      if (typeof traits[key] === "boolean") {
        response.endpoint = `${BASE_URL}/api/named_users/tags`;
        //   set(payload, "audience.named_user_id", "payload.named_user_id");
        if (traits[key] === true) {
          payload.add.rudderstack_integration_group.push(key);
          // set(payload, "add.rudderstack_integration_group", key);
          // payload.adds.push(add);
        }
        if (traits[key] === false) {
          payload.remove.rudderstack_integration_group.push(key);
          // remove.rudderstack_integration_group = key;
          // set(payload, "remove.rudderstack_integration_group", key);
          // payload.removes.push(remove);
        }
      }
    });
  } else {
    const timestamp = getFieldValueFromMessage(message, "timestamp");
    payload.attributes = [];
    Object.keys(traits).forEach(key => {
      if (typeof traits[key] !== "boolean") {
        response.endpoint = `${BASE_URL}/api/named_users/${payload.named_user_id}/attributes`;
        const attribute = {};
        attribute.set = "set";
        attribute.key = key.replace(/\./g, "_");
        attribute.value = traits[key];
        attribute.timestamp = timestamp;
        payload.attributes.push(attribute);
      }
    });
  }

  response.headers = {
    "Content-Type": "application/json",
    Accept: "application/vnd.urbanairship+json; version=3",
    Authorization: `Basic ${btoa(`${appKey}:${appSecret}`)}`
  };
  response.method = defaultPostRequestConfig.requestMethod;
  response.body.JSON = removeUndefinedAndNullValues(payload);
  return response;
};

const process = async event => {
  const { message, destination } = event;
  if (!message.type) {
    throw new CustomError(
      "Message Type is not present. Aborting message.",
      400
    );
  }

  //   if (!destination.Config.apiKey) {
  //     throw new CustomError("Inavalid API Key. Aborting message.", 400);
  //   }

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

//-----------------------------------------------------------------------------------------
