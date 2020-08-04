const {
  CONFIG_CATEGORIES,
  destinationConfigKeys,
  MAPPING_CONFIG
} = require("./config");
const { EventType } = require("../../../constants");
const {
  constructPayload,
  defaultPostRequestConfig,
  removeUndefinedAndNullValues,
  defaultRequestConfig,
  flattenJson,
  getFieldValueFromMessage
} = require("../../util");

function getDestinationKeys(destination) {
  const heapConfig = {};
  const configKeys = Object.keys(destination.Config);
  configKeys.forEach(key => {
    switch (key) {
      case destinationConfigKeys.appId:
        heapConfig.app_id = `${destination.Config[key]}`;
        break;
      default:
        break;
    }
  });
  return heapConfig;
}
function responseBuilderSimple(message, category, destination) {
  const payload = constructPayload(message, MAPPING_CONFIG[category.name]);
  if (payload) {
    payload.properties = flattenJson(payload.properties);
    const heapConfig = getDestinationKeys(destination);
    const responseBody = {
      ...payload,
      app_id: heapConfig.app_id
    };
    const response = defaultRequestConfig();
    response.endpoint = category.endPoint;
    response.method = defaultPostRequestConfig.requestMethod;
    response.headers = {
      "Content-Type": "application/json",
      Accept: "application/json"
    };
    response.userId = message.anonymousId;
    response.body.JSON = removeUndefinedAndNullValues(responseBody);
    return response;
  }
  // fail-safety for developer error
  throw new Error("Payload could not be constructed");
}

const processEvent = (message, destination) => {
  if (!message.type) {
    throw Error("Message Type is not present. Aborting message.");
  }
  const messageType = message.type.toLowerCase();
  let category;
  const respList = [];
  switch (messageType) {
    case EventType.IDENTIFY:
      category = CONFIG_CATEGORIES.IDENTIFY;
      break;
    case EventType.PAGE:
      throw Error("Page calls are not supported for Heap.");
    case EventType.SCREEN:
      throw Error("Screen calls are not supported for Heap.");
    case EventType.TRACK:
      category = CONFIG_CATEGORIES.TRACK;
      break;
    default:
      throw new Error("Message type not supported");
  }

  // build the response
  respList.push(responseBuilderSimple(message, category, destination));
  return respList;
};

const process = event => {
  try {
    return processEvent(event.message, event.destination);
  } catch (error) {
    throw new Error(error.message || "Unknown error");
  }
};

exports.process = process;
