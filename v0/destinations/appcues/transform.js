const get = require("get-value");
const set = require("set-value");
const {
  EventType
} = require("../../../constants");

const {
  constructPayload,
  defaultRequestConfig,
  getValueFromMessage,
  removeUndefinedAndNullValues,
  removeUndefinedAndNullAndEmptyValues,
  toUnixTimestamp
} = require("../../util");

const {
  ConfigCategory,
  mappingConfig,
  getEndpoint,
} = require("./config");

function buildResponse(message, payload, endpoint) {
  const response = defaultRequestConfig();
  response.endpoint = endpoint;
  response.body.JSON = removeUndefinedAndNullValues(payload);
  return {
    ...response,
    headers: {
      "Content-Type": "application/json",
    }
  };
}

function processIdentify(message, destination, mappingJson) {
  return buildResponse(
    message,
    constructPayload(message,mappingJson),
    getEndpoint(destination.Config.accountId, message.userId)
  );
}

function processTrackEvent(message, destination, mappingJson) {
  let requestJson = {};
  if (message.messageId) {
    requestJson.request_id = message.messageId;
  }

  let eventJson = constructPayload(message,mappingJson); 
  eventJson.timestamp = toUnixTimestamp(eventJson.timestamp);
  requestJson.events = [eventJson];

  return buildResponse(
    message,
    requestJson,
    getEndpoint(destination.Config.accountId, message.userId)
  );

}

function processPage(message, destination, trackMappingJson, profileMappingJson) {

  let requestJson = {};
  if (message.messageId) {
    requestJson.request_id = message.messageId;
  }

  // generating profile part of the payload
  let profileJson = constructPayload(message,profileMappingJson);
  profileJson._appcuesId = destination.Config.accountId;
  requestJson.profile_update = profileJson;

  // generating event part of the payload
  let eventJson = constructPayload(message, trackMappingJson);
  eventJson.timestamp = toUnixTimestamp(eventJson.timestamp);
  eventJson.name = "Viewed a Page";
  eventJson.attributes._identity = {};
  eventJson.attributes._identity.userId = message.userId;
  eventJson.attributes = removeUndefinedAndNullAndEmptyValues(eventJson.attributes);
  if ((message.properties && message.properties.url) || (message.context.page && message.context.page.url)) {
    eventJson.context = {};
    const sourceKeys = ["context.page.url", "properties.url"];
    eventJson.context.url = getValueFromMessage(message, sourceKeys);
  }
  requestJson.events = [eventJson];

  return buildResponse(
    message,
    requestJson,
    getEndpoint(destination.Config.accountId, message.userId)
  );
}

function process(event) {
  const respList = [];
  let response;
  const {
    message,
    destination
  } = event;

  if (!message.type) {
    throw new Error("Message Type is not present. Aborting message.");
  }

  const messageType = message.type.toLowerCase();

  let category = ConfigCategory.TRACK;
  let profileCategory = ConfigCategory.PROFILE;

  switch (messageType) {
    case EventType.TRACK:
      response = processTrackEvent(
        message,
        destination,
        mappingConfig[category.name]
      );
      break;
    case EventType.PAGE:
      response = processPage(
        message, 
        destination, 
        mappingConfig[category.name],
        mappingConfig[profileCategory.name]
      );
      break;
    case EventType.SCREEN:
      message.event = "Viewed a Screen";
      response = processTrackEvent(
        message,
        destination,
        mappingConfig[category.name]
      );
      break;
    case EventType.IDENTIFY:
      category = ConfigCategory.IDENTIFY;
      response = processIdentify(
        message,
        destination,
        mappingConfig[category.name]
      );
      break;
    default:
      throw new Error("Message type is not supported");
  }

  return response;
}

module.exports = {
  process
};