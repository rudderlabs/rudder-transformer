const { CONFIG_CATEGORIES, MAPPING_CONFIG } = require("./config");
const { EventType } = require("../../../constants");
const {
  constructPayload,
  defaultPostRequestConfig,
  removeUndefinedAndNullValues,
  defaultRequestConfig,
  flattenJson
} = require("../../util");

function getDestinationKeys(destination) {
  return { app_id: destination.Config.appId };
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
  return processEvent(event.message, event.destination);
};

exports.process = process;
