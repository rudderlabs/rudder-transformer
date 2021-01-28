const { EventType } = require("../../../constants");
const {
  CONFIG_CATEGORIES,
  BASE_ENDPOINT,
  MAPPING_CONFIG
} = require("./config");
const {
  defaultRequestConfig,
  constructPayload,
  defaultPostRequestConfig,
  defaultGetRequestConfig
} = require("../../util");

// const responseBuilderSimple = (payload, category, destination) => {
//   if (payload) {
//     const responseBody = { ...payload, apiKey: destination.Config.apiKey };
//     const response = defaultRequestConfig();
//     response.endpoint = category.endPoint;
//     response.method = defaultPostRequestConfig.requestMethod;
//     response.headers = {
//       "Content-Type": "application/json"
//     };
//     response.body.JSON = responseBody;
//     return response;
//   }
//   // fail-safety for developer error
//   throw new Error("Payload could not be constructed");
// };

const identifyRequestHandler = (message, category, destination) => {
  const payload = {
    token: destination.Config.pubApiKey,
    properties: constructPayload(message, MAPPING_CONFIG[category.name])
  };
  const encodedData = Buffer.from(JSON.stringify(payload)).toString("base64");
  const response = defaultRequestConfig();
  response.endpoint = `${BASE_ENDPOINT}${category.endPoint}?data=${encodedData}`;
  response.method = defaultGetRequestConfig.requestMethod;
  return response;
};

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
      response = identifyRequestHandler(message, category, destination);
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
  return response;
};

const process = event => {
  return processEvent(event.message, event.destination);
};

exports.process = process;
