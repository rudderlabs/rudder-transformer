const {
  CONFIG_CATEGORIES,
  MAPPING_CONFIG,
  KEY_CHECK_LIST
} = require("./config");
const { EventType } = require("../../../constants");
const {
  removeUndefinedAndNullValues,
  defaultPostRequestConfig,
  defaultRequestConfig,
  constructPayload
} = require("../../util");

let bufferProperty = {};

function responseBuilderSimple(payload, category, destination) {
  if (payload) {
    const responseBody = payload;
    const response = defaultRequestConfig();
    response.endpoint = category.endPoint;
    response.method = defaultPostRequestConfig.requestMethod;
    response.headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${destination.Config.apiKey}`
    };
    response.body.JSON = removeUndefinedAndNullValues(responseBody);
    return response;
  }
  // fail-safety for developer error
  throw new Error("Payload could not be constructed");
}

function populateOutputProperty(inputObject) {
  Object.keys(inputObject).forEach(key => {
    if (!KEY_CHECK_LIST.includes(key)) {
      bufferProperty[key] = inputObject[key];
    }
  });
  return bufferProperty;
}

function sendEvent(message, destination, category) {
  const { environment } = destination.Config;
  const { type } = message;
  const eventTypeIdRegex = new RegExp("[a-zA-Z0-9][-_.a-zA-Z0-9]{0,62}");
  let outputPayload = {};
  let bufferProperty1 = {};
  let bufferProperty2 = {};

  switch (type) {
    case EventType.IDENTIFY:
    case EventType.GROUP:
      if (message.traits) {
        bufferProperty1 = populateOutputProperty(message.traits);
      }
      if (message.context && message.context.traits) {
        bufferProperty2 = populateOutputProperty(message.context.traits);
      }
      bufferProperty = Object.assign(bufferProperty1, bufferProperty2);
      break;
    case EventType.TRACK:
    case EventType.PAGE:
    case EventType.SCREEN:
      bufferProperty = populateOutputProperty(message.properties);
      break;
    default:
      throw new Error("Message type not supported");
  }
  if (eventTypeIdRegex.test(outputPayload.eventTypeId)) {
    outputPayload = constructPayload(message, MAPPING_CONFIG[category.name]);
    if (type === "page" || type === "screen") {
      outputPayload.eventTypeId = `viewed ${outputPayload.eventTypeId}`;
    }
  } else {
    throw new Error("eventTypeId does not match with ideal format");
  }
  if (!Object.prototype.hasOwnProperty.call(outputPayload, "environmentName")) {
    outputPayload.environmentName = environment;
  }
  outputPayload.properties = bufferProperty;

  return outputPayload;
}

const processEvent = (message, destination) => {
  if (!message.type) {
    throw Error("Message Type is not present. Aborting message.");
  }

  const messageType = message.type.toLowerCase();
  let category;
  let response;
  switch (messageType) {
    case EventType.IDENTIFY:
      category = CONFIG_CATEGORIES.EVENT;
      response = sendEvent(message, destination, category);
      break;
    case EventType.TRACK:
    case EventType.PAGE:
    case EventType.SCREEN:
      category = CONFIG_CATEGORIES.EVENT;
      response = sendEvent(message, destination, category);
      break;
    case EventType.GROUP:
      category = CONFIG_CATEGORIES.EVENT;
      response = sendEvent(message, destination, category);
      break;
    default:
      throw new Error("Message type not supported");
  }

  // build the response
  return responseBuilderSimple(response, category, destination);
};

const process = event => {
  return processEvent(event.message, event.destination);
};

exports.process = process;
