const { EventType } = require("../../../constants");
const {
  destinationConfigKeys,
  CONFIG_CATEGORIES,
  MAPPING_CONFIG
} = require("./config");

const {
  defaultPostRequestConfig,
  defaultRequestConfig,
  removeUndefinedAndNullValues,
  constructPayload
} = require("../../util");

function getDestinationKeys(destination) {
  const autoPilotConfig = {};
  const configKeys = Object.keys(destination.Config);
  configKeys.forEach(key => {
    switch (key) {
      case destinationConfigKeys.apiKey:
        autoPilotConfig.apiKey = `${destination.Config[key]}`;
        break;
      case destinationConfigKeys.triggerId:
        autoPilotConfig.triggerId = `${destination.Config[key]}`;
        break;
      default:
        break;
    }
  });
  return autoPilotConfig;
}

function responseBuilderSimple(message, category, destination) {
  const payload = constructPayload(message, MAPPING_CONFIG[category.name]);
  if (payload) {
    const autoPilotConfig = getDestinationKeys(destination);
    const response = defaultRequestConfig();
    response.headers = {
      autopilotapikey: `${autoPilotConfig.apiKey}`,
      "Content-Type": "application/json",
      Accept: "application/json"
    };
    let responseBody;
    switch (message.type) {
      case EventType.IDENTIFY:
        responseBody = {
          contact: { ...payload }
        };
        response.endpoint = category.endPoint.addContactUrl;
        break;
      case EventType.TRACK:
        responseBody = { ...payload };
        response.endpoint = `${category.endPoint.triggerJourneyUrl}/${autoPilotConfig.triggerId}/contact/${message.context.traits.email}`;
        break;
      default:
        break;
    }
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
