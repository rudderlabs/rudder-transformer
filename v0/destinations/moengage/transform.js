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
  // check the region and which api end point should be used
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
    Authorization: `Basic ${btoa(`${apiId}:${apiKey}`)}` // Basic Authentication encodes a 'username:password' using base64 and prepends it with the string 'Basic '.
  };
  response.userId = message.anonymousId || message.userId;
  if (payload) {
    switch (category.type) {
      case "identify":
        payload.type = "customer"; // https://docs.moengage.com/docs/data-import-apis#user-api
        payload.attributes = constructPayload(
          message,
          MAPPING_CONFIG[CONFIG_CATEGORIES.IDENTIFY_ATTR.name]
        );
        payload.attributes = flattenJson(payload.attributes); // nested attributes are not shown on dashboard of moengage so it is falttened
        break;
      case "device":
        payload.type = "device"; // https://docs.moengage.com/docs/data-import-apis#device-api
        payload.attributes = constructPayload(
          message,
          MAPPING_CONFIG[CONFIG_CATEGORIES.DEVICE_ATTR.name]
        );
        payload.attributes = flattenJson(payload.attributes); // nested attributes are not shown on dashboard of moengage so it is falttened
        break;
      case "track":
        payload.type = "event"; // https://docs.moengage.com/docs/data-import-apis#event-api
        payload.actions = [
          constructPayload(
            message,
            MAPPING_CONFIG[CONFIG_CATEGORIES.TRACK_ATTR.name]
          )
        ];
        break;
      default:
        throw new Error("Call type is not valid");
    }

    response.body.JSON = removeUndefinedAndNullValues(payload);
  } else {
    throw new Error("Payload could not be constructed"); // fail-safety for developer error
  }
  return response;
}

const processEvent = (message, destination) => {
  if (!message.type) {
    throw new Error("Message Type is not present. Aborting message.");
  }

  const messageType = message.type.toLowerCase();
  let category;
  let response;
  switch (messageType) {
    case EventType.IDENTIFY:
      category = CONFIG_CATEGORIES.IDENTIFY;
      response = responseBuilderSimple(message, category, destination);
      // only if device information is present device info will be added/updated with an identify call otherwise only user info will be added/updated
      if (
        message.context.device &&
        message.context.device.type &&
        message.context.device.token
      ) {
        response = [
          // build the response
          response, // user api payload
          responseBuilderSimple(message, CONFIG_CATEGORIES.DEVICE, destination) // device api payload
        ];
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
