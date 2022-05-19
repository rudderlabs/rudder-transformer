const { EventType } = require("../../../constants");
const { CONFIG_CATEGORIES, MAPPING_CONFIG, BASE_URL } = require("./config");
const get = require("get-value");
const {
  defaultRequestConfig,
  getFieldValueFromMessage,
  constructPayload,
  defaultPostRequestConfig,
  removeUndefinedAndNullValues,
  getIntegrationsObj,
  CustomError
} = require("../../util");

const identifyResponseBuilder = (message, { Config }) => {
  const { apiKey, signUpSourceId } = Config;
  let endpoint; 
  const integrationsObj = getIntegrationsObj(message, "attentive_tag");
  let payload;
  if (integrationsObj) {
    if (integrationsObj.signUpSourceId) {
      signUpSourceId = integrationsObj.signUpSourceId;
    }
    if (integrationsObj?.identifyOperation.toLowerCase() === "unsubscribe") {
      endpoint = "/subscriptions/unsubscribe";
      payload = constructPayload(message, attentiveUnsubscribeConfig);
    }
    if (integrationsObj?.identifyOperation.toLowerCase() == "subscribe") {
      endpoint = "/subscriptions";
      payload = constructPayload(message, attentiveSubscribeConfig);
    }
  }
  if (payload) {
    const response = defaultRequestConfig();
    response.endpoint = `${BASE_URL}endpoint`;
    response.headers = {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    };
    response.method = defaultPostRequestConfig.requestMethod;
    response.body.JSON = removeUndefinedAndNullValues(payload);
  }
  return response;
};
const trackResponseBuilder = (message, { Config }) => {
  const { apiKey } = Config;

  let event = get(message, "event");
  let endpoint;

  switch (event.toLowerCase()) {
    /* Browsing Section */
    case "product_list_viewed":
      payload = constructPayload(
        message,
        MAPPING_CONFIG[CONFIG_CATEGORIES.PRODUCT_LIST_VIEWED.name]
      );
      endpoint = CONFIG_CATEGORIES.PRODUCT_LIST_VIEWED.endpoint;
      break;
    /* Ordering Section */
    case "product_viewed":
      payload = constructPayload(
        message,
        MAPPING_CONFIG[CONFIG_CATEGORIES.PRODUCT_VIEWED.name]
      );
      endpoint = CONFIG_CATEGORIES.PRODUCT_VIEWED.endpoint;
      break;
    case "order_completed":
      payload = constructPayload(
        message,
        MAPPING_CONFIG[CONFIG_CATEGORIES.ORDER_COMPLETED.name]
      );
      endpoint = CONFIG_CATEGORIES.ORDER_COMPLETED.endpoint;
      break;
    case "product_added":
      payload = constructPayload(
        message,
        MAPPING_CONFIG[CONFIG_CATEGORIES.PRODUCT_ADDED.name]
      );
      endpoint = CONFIG_CATEGORIES.PRODUCT_ADDED.endpoint;
      break;
    default:
      payload = constructPayload(
        message,
        MAPPING_CONFIG[CONFIG_CATEGORIES.TRACK.name]
      );
      endpoint = CONFIG_CATEGORIES.TRACK.endpoint;
  }
  if (payload) {
    const response = defaultRequestConfig();
    response.endpoint = `${BASE_URL}${endpoint}`;
    response.method = defaultPostRequestConfig.requestMethod;
    response.headers = {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    };
    response.body.JSON = removeUndefinedAndNullValues(payload);
    return response;
  }
};

const processEvent = (message, destination) => {
  if (!message.type) {
    throw Error("Message Type is not present. Aborting message.");
  }
  const messageType = message.type.toLowerCase();

  switch (messageType) {
    case EventType.IDENTIFY:
      response = identifyResponseBuilder(message, destination);
      break;
    case EventType.TRACK:
      response = trackResponseBuilder(message, destination);
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
