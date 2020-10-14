const btoa = require("btoa");
const { EventType } = require("../../../constants");
const {
  CONFIG_CATEGORIES,
  MAPPING_CONFIG,
  endpointEU,
  endpointIND,
  endpointUS
} = require("./config");
const {
  constructPayload,
  defaultPostRequestConfig,
  removeUndefinedAndNullValues,
  defaultRequestConfig,
  flattenJson
} = require("../../util");

function responseBuilderSimple(message, category, destination) {
  const payload = constructPayload(message, MAPPING_CONFIG[category.name]);
  const { apiId, region, apiKey } = destination.Config;
  const response = defaultRequestConfig();
  switch (region) {
    case "EU":
      response.endpoint = `${endpointEU[category.type]}${apiId}`;
      break;
    case "US":
      response.endpoint = `${endpointUS[category.type]}${apiId}`;
      break;
    case "IND":
      response.endpoint = `${endpointIND[category.type]}${apiId}`;
      break;
    default:
      throw new Error("The region is not valid");
  }
  response.method = defaultPostRequestConfig.requestMethod;
  response.headers = {
    "Content-Type": "application/json",
    "MOE-APPKEY": apiId,
    Authorization: `Basic ${btoa(`${apiId}:${apiKey}`)}`
  };
  response.userId = message.anonymousId || message.userId;
  if (payload) {
    switch (category.type) {
      case "identify":
        payload.type = "customer";
        payload.attributes = constructPayload(
          message,
          MAPPING_CONFIG[CONFIG_CATEGORIES.IDENTIFY_ATTR.name]
        );
        payload.attributes = flattenJson(payload.attributes);
        break;
      case "device":
        payload.type = "device";
        payload.attributes = constructPayload(
          message,
          MAPPING_CONFIG[CONFIG_CATEGORIES.DEVICE_ATTR.name]
        );
        payload.attributes = flattenJson(payload.attributes);
        break;
      case "track":
        payload.type = "event";
        break;
      default:
        throw new Error("Call type is not valid");
    }

    response.body.JSON = removeUndefinedAndNullValues(payload);
  } else {
    // fail-safety for developer error
    throw new Error("Payload could not be constructed");
  }
  return response;
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
      if (message.context.device.type && message.context.device.token) {
        // build the response
        response = [
          responseBuilderSimple(message, category, destination),
          responseBuilderSimple(message, CONFIG_CATEGORIES.DEVICE, destination)
        ];
      } else {
        response = responseBuilderSimple(message, category, destination);
      }
      break;
    case EventType.TRACK:
      category = CONFIG_CATEGORIES.TRACK;
      // build the response
      response = responseBuilderSimple(message, category, destination);
      break;
    default:
      throw new Error("Message type not supported");
  }

  return response;
};

const process = event => {
  return processEvent(event.message, event.destination);
};

exports.process = process;
