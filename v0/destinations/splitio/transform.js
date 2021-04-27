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
  constructPayload,
  isDefined
} = require("../../util");



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
  const outputProperty = {};
  Object.keys(inputObject).forEach(key => {
    if (!KEY_CHECK_LIST.includes(key) && !Array.isArray(inputObject[key])) {
      outputProperty[key] = inputObject[key];
    }
  });
  return outputProperty;
}

function sendEvent(message, destination, category) {
  let bufferProperty = {};
  const { environment, trafficType } = destination.Config;
  const { type } = message;
  const eventTypeIdRegex = new RegExp("^[a-zA-Z0-9][-_\.a-zA-Z0-9]{0,79}$");

  let outputPayload = {};

  outputPayload = constructPayload(message, MAPPING_CONFIG[category.name]);
  outputPayload.eventTypeId = outputPayload.eventTypeId.replace(/ /g, "_");
  if (eventTypeIdRegex.test(outputPayload.eventTypeId)) {
    switch (type) {
      case EventType.IDENTIFY:
        if (message.traits) {
          bufferProperty = populateOutputProperty(message.traits);
        } else if (message.context && message.context.traits) {
          bufferProperty = populateOutputProperty(message.context.traits);
        }
        break;
      case EventType.GROUP:
        if (message.traits) {
          bufferProperty = populateOutputProperty(message.traits);
        }
        break;
      case EventType.TRACK:
      case EventType.PAGE:
      case EventType.SCREEN:
        if (message.properties) {
          bufferProperty = populateOutputProperty(message.properties);
        }
        if (message.category) {
          bufferProperty.category = message.category;
        }
        if (type !== "track") {
          outputPayload.eventTypeId = `Viewed_${outputPayload.eventTypeId}_${type}`;
        }
        break;
      default:
        throw new Error("Message type not supported");
    }
  } else {
    throw new Error("eventTypeId does not match with ideal format");
  }
  if (isDefined(environment)) {
    outputPayload.environmentName = environment;
  }
  outputPayload.trafficTypeName = trafficType;
  outputPayload.properties = bufferProperty;

  return outputPayload;
}

const processEvent = (message, destination) => {
  if (!message.type) {
    throw Error("Message Type is not present. Aborting message.");
  }
  const category = CONFIG_CATEGORIES.EVENT;
  const response = sendEvent(message, destination, category);
  // build the response
  return responseBuilderSimple(response, category, destination);
};

const process = event => {
  return processEvent(event.message, event.destination);
};

exports.process = process;
