const get = require("get-value");

const {
  EventType
} = require("../../../constants");
const {
  defaultRequestConfig,
  getFieldValueFromMessage,
  removeUndefinedAndNullValues
} = require("../../util");
const {
  ConfigCategory,
  mappingConfig,
  getEndpoint,
} = require("./config");

function buildResponse(message, identifyPayload, endpoint) {
  const response = defaultRequestConfig();
  response.endpoint = endpoint;
  response.userId = message.userId || message.anonymousId;
  response.body.JSON = removeUndefinedAndNullValues(identifyPayload);
  return {
    ...response,
    headers: {
      "Content-Type": "application/json",
    }
  };
}

function getIdentifyPayload(message) {
  let payload = {};
  if (message.messageId) {
    payload.request_id = message.messageId;
  }
  const traits = getFieldValueFromMessage(message, "traits");
  if (traits && Object.keys(traits).length > 0) {
    payload.profile_update = traits;
  }

}

function processIdentify(message, destination) {
  return buildResponse(
    message,
    getIdentifyPayload(message),
    getEndpoint(destination.Config.accountId, message.userId)
  );
}

function processTrackEvent(message, destination, mappingJson) {
  const requestJson = {};

  // iterate over the destKeys and set the value if present
  Object.keys(mappingJson).forEach(destKey => {
    let value = get(message, mappingJson[destKey]);
    if (value) {
      requestJson[destKey] = value;
    }
  });

  return buildResponse(
    message,
    destination,
    requestJson,
    getEndPoint(destination.Config.accountId, message.userId)
  );
}

function process(event) {
  const respList = [];
  let response;
  const {
    message,
    destination
  } = event;
  const messageType = message.type.toLowerCase();

  let category = ConfigCategory.TRACK;

  switch (messageType) {
    case EventType.TRACK:
      response = processTrackEvent(
        messageType,
        message,
        destination,
        mappingConfig[category.name]
      );
      respList.push(response);
      break;
    case EventType.PAGE:
      // need to implement page
      break;
    case EventType.IDENTIFY:
      response = processIdentify(
        message,
        destination
      );
      if (response) {
        respList.push(response);
      }
      break;
    default:
      throw new Error("Message type is not supported");
  }

  return respList;
}

module.exports = {
  process
};