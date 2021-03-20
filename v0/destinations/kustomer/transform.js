const { EventType } = require("../../../constants");
const {
  CONFIG_CATEGORIES,
  MAPPING_CONFIG,
  BASE_ENDPOINT
} = require("./config");
const {
  defaultRequestConfig,
  getFieldValueFromMessage,
  constructPayload,
  defaultPostRequestConfig,
  removeUndefinedAndNullValues
} = require("../../util");
const { validateEvent } = require("./util");

const responseBuilderSimple = (message, category, destination) => {
  let payload = {};
  let targetUrl = BASE_ENDPOINT;
  if (message.type.toLowerCase() == EventType.IDENTIFY) {
    /*
    Find the user with externalId (rudder userId/anonymousId)
    If anonymousId is present search using it/ else use userID to search

    If User Present —> Use the update api for creating request and update the payload attributes

    Else 

    Create New user using create API —> useriD/ anonymous Id will be mapped to externalId
    New user will be created with the payload attributes */
    throw Error("Not implemented yet");
  } else {
    targetUrl = `${targetUrl}/v1/tracking/identityEvent`;
    const eventPayload = constructPayload(
      message,
      MAPPING_CONFIG[category.name]
    );
    removeUndefinedAndNullValues(eventPayload);
    validateEvent(eventPayload);
    payload = {
      identity: {
        externalId: getFieldValueFromMessage(message, "userId")
      },
      event: eventPayload
    };
  }
  if (payload) {
    const responseBody = { ...payload };
    const response = defaultRequestConfig();
    response.endpoint = targetUrl;
    response.method = defaultPostRequestConfig.requestMethod;
    response.headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${destination.Config.apiKey}`
    };
    response.body.JSON = responseBody;
    return response;
  }
  // fail-safety for developer error
  throw new Error("Payload could not be constructed");
};

const processEvent = (message, destination) => {
  if (!message.type) {
    throw Error("Message Type is not present. Aborting message.");
  }
  const messageType = message.type.toLowerCase();

  let category;
  switch (messageType) {
    case EventType.IDENTIFY:
      category = CONFIG_CATEGORIES.IDENTIFY;
      break;
    case EventType.PAGE:
      category = CONFIG_CATEGORIES.PAGE;
      break;
    case EventType.SCREEN:
      category = CONFIG_CATEGORIES.SCREEN;
      break;
    case EventType.TRACK:
      category = CONFIG_CATEGORIES.TRACK;
      break;
    default:
      throw new Error("Message type not supported");
  }
  return responseBuilderSimple(message, category, destination);
};

const process = event => {
  return processEvent(event.message, event.destination);
};

exports.process = process;
