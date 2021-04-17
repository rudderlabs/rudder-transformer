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
  getFieldValueFromMessage,
  isDefined,
  constructPayload
} = require("../../util");

function responseBuilderSimple(payload, category, destination) {
  // const payload = constructPayload(message, MAPPING_CONFIG[category.name]);
  if (payload) {
    const responseBody = payload;
    const response = defaultRequestConfig();
    response.endpoint = category.endPoint;
    response.method = defaultPostRequestConfig.requestMethod;
    response.headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer${destination.Config.apiKey}`
    };
    response.body.JSON = removeUndefinedAndNullValues(responseBody);
    return response;
  }
  // fail-safety for developer error
  throw new Error("Payload could not be constructed");
}

function sendEvent(message, destination, category) {
  const { trafficType, environment } = destination.Config;
  const { userId, anonymousId, properties, type } = message;
  const { eventTypeId, environmentName, value } = message.properties;
  const bufferProperty = {};
  const eventTypeIdRegex = new RegExp("[a-zA-Z0-9][-_.a-zA-Z0-9]{0,62}");

  Object.keys(properties).forEach(key => {
    if (!KEY_CHECK_LIST.includes(key)) {
      bufferProperty[key] = properties[key];
    }
  });

  // const outputPayload = {
  //   eventTypeId: isDefined(eventTypeId)
  //     ? String(eventTypeId)
  //     : isDefined(message.event)
  //     ? message.event
  //     : `Viewed ${message.name}`,
  //   environmentName: isDefined(environmentName)
  //     ? String(environmentName)
  //     : environment,
  //   trafficTypeName: trafficType,
  //   key: userId ? message.userId : anonymousId,
  //   timestamp: (
  //     getFieldValueFromMessage(message, "historicalTimestamp") / 1000
  //   ).toFixed(0),
  //   value: parseFloat(value),
  //   properties: bufferProperty
  // };

  const outputPayload = constructPayload(
    message,
    MAPPING_CONFIG[category.name]
  );
  if (eventTypeIdRegex.test(outputPayload.eventTypeId)) {
    if (type === "page" || type === "screen") {
      outputPayload.eventTypeId = `viewed ${outputPayload.eventTypeId}`;
    }
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
      category = CONFIG_CATEGORIES.IDENTIFY;
      break;
    case EventType.TRACK:
    case EventType.PAGE:
    case EventType.SCREEN:
      category = CONFIG_CATEGORIES.EVENT;
      response = sendEvent(message, destination, category);
      break;
    case EventType.GROUP:
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
