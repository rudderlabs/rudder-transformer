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

const {
  utcTimeToEpoch,
  removeEmptyUndefinedandNullValues
} = require("./utils");

function buildResponse(message, payload, endpoint) {
  const response = defaultRequestConfig();
  response.endpoint = endpoint;
  response.userId = message.userId || message.anonymousId;
  response.body.JSON = removeUndefinedAndNullValues(payload);
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
  return payload;
}

function processIdentify(message, destination) {
  return buildResponse(
    message,
    getIdentifyPayload(message),
    getEndpoint(destination.Config.accountId, message.userId)
  );
}

function getTrackPayload(message, mappingJson) {
  let eventJson = {};
  
  // iterate over the destKeys and set the value if present
  Object.keys(mappingJson).forEach(destKey => {
    let value = get(message, mappingJson[destKey]);
    if (value) {
      eventJson[destKey] = value;
    }
  });
  return eventJson;
}

function processTrackEvent(message, destination, mappingJson) {
  let requestJson = {};
  if (message.messageId) {
    requestJson.request_id = message.messageId;
  }

  let eventJson = getTrackPayload(message, mappingJson);
  eventJson.timestamp = utcTimeToEpoch(eventJson.timestamp);
  requestJson.events = [eventJson];

  return buildResponse(
    message,
    requestJson,
    getEndpoint(destination.Config.accountId, message.userId)
  );

}

function getProfilePayload(message) {
  let profileJson = {};
  const category = ConfigCategory.PROFILE;
  const mappingJson = mappingConfig[category.name];
  Object.keys(mappingJson).forEach(destKey => {
    let value = get(message, mappingJson[destKey]);
    if (value) {
      profileJson[destKey] = value;
    }
  });
  return profileJson;
}

function processPage(message, destination, mappingJson) {
  
  let requestJson = {};
  if (message.messageId) {
    requestJson.request_id = message.messageId;
  }

  // generating profile part of the payload
  let profileJson = getProfilePayload(message);
  profileJson._appcuesId = destination.Config.accountId;
  requestJson.profile_update = profileJson;
  
  // generating event part of the payload
  let eventJson = getTrackPayload(message, mappingJson);
  eventJson.timestamp = utcTimeToEpoch(eventJson.timestamp);
  eventJson.name = "Viewed a Page";
  eventJson.attributes._identity = {};
  eventJson.attributes._identity.userId = message.userId;
  eventJson.attributes = removeEmptyUndefinedandNullValues(eventJson.attributes);
  eventJson.context = {};
  eventJson.context.url = message.context.page.url;
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
  const messageType = message.type.toLowerCase();

  let category = ConfigCategory.TRACK;

  switch (messageType) {
    case EventType.TRACK:
      response = processTrackEvent(
        message,
        destination,
        mappingConfig[category.name]
      );
      break;
    case EventType.PAGE:
      response = processPage(message, destination, mappingConfig[category.name]);
      break;
    case EventType.IDENTIFY:
      response = processIdentify(
        message,
        destination
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