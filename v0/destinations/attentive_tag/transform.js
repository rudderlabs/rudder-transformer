const { EventType } = require("../../../constants");
const { ConfigCategory, mappingConfig, BASE_URL } = require("./config");
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
const {
  getDestinationItemProperties,
  getExternalIdentifiersMapping,
  getUserExistence
} = require("./util");

const identifyResponseBuilder = async (message, { Config }) => {
  const { apiKey } = Config;
  let { signUpSourceId } = Config;
  let endpoint, payload;
  const integrationsObj = getIntegrationsObj(message, "attentive_tag");
  let userPhone = getFieldValueFromMessage(message, "phone");
  let userEmail = getFieldValueFromMessage(message, "email");
  if (integrationsObj) {
    if (integrationsObj.signUpSourceId) {
      signUpSourceId = integrationsObj.signUpSourceId;
    }
    if (integrationsObj?.identifyOperation?.toLowerCase() === "unsubscribe") {
        await getUserExistence(message, apiKey);
      endpoint = "/subscriptions/unsubscribe";
      payload = constructPayload(
        message,
        mappingConfig[ConfigCategory.UNSUBSCRIBE.name]
      );
      payload.subscriptions = integrationsObj?.subscriptions;
    }
    if (integrationsObj?.identifyOperation?.toLowerCase() === "subscribe") {
      endpoint = "/subscriptions";
      payload = constructPayload(
        message,
        mappingConfig[ConfigCategory.SUBSCRIBE.name]
      );
      payload.signUpSourceId = signUpSourceId;
      payload.externalIdentifiers = getExternalIdentifiersMapping(message);
    }
  }
  if (payload) {
    const response = defaultRequestConfig();
    response.endpoint = `${BASE_URL}${endpoint}`;
    response.headers = {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    };
    response.method = defaultPostRequestConfig.requestMethod;
    response.body.JSON = removeUndefinedAndNullValues(payload);
    return response;
  }
};
const trackResponseBuilder = (message, { Config }) => {
  const { apiKey } = Config;

  let event = get(message, "event");
  let endpoint;

  switch (
    event
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "_")
  ) {
    /* Browsing Section */
    case "product_list_viewed":
      payload = constructPayload(
        message,
        mappingConfig[ConfigCategory.PRODUCT_LIST_VIEWED.name]
      );
      endpoint = ConfigCategory.PRODUCT_LIST_VIEWED.endpoint;
      payload.items = getDestinationItemProperties(message, true);
      break;
    /* Ordering Section */
    case "product_viewed":
      payload = constructPayload(
        message,
        mappingConfig[ConfigCategory.PRODUCT_VIEWED.name]
      );
      endpoint = ConfigCategory.PRODUCT_VIEWED.endpoint;
      payload.items = getDestinationItemProperties(message, true);
      break;
    case "order_completed":
      payload = constructPayload(
        message,
        mappingConfig[ConfigCategory.ORDER_COMPLETED.name]
      );
      endpoint = ConfigCategory.ORDER_COMPLETED.endpoint;
      payload.items = getDestinationItemProperties(message, true);
      break;
    case "product_added":
      payload = constructPayload(
        message,
        mappingConfig[ConfigCategory.PRODUCT_ADDED.name]
      );
      endpoint = ConfigCategory.PRODUCT_ADDED.endpoint;
      payload.items = getDestinationItemProperties(message, true);
      break;
    default:
      payload = constructPayload(
        message,
        mappingConfig[ConfigCategory.TRACK.name]
      );
      endpoint = ConfigCategory.TRACK.endpoint;
      payload.type = get(message, "event");
  }
  if (payload) {
    const response = defaultRequestConfig();
    response.endpoint = `${BASE_URL}/${endpoint}`;
    response.method = defaultPostRequestConfig.requestMethod;
    response.headers = {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    };
    response.body.JSON = removeUndefinedAndNullValues(payload);
    return response;
  }
};

const processEvent = async (message, destination) => {
  if (!message.type) {
    throw Error("Message Type is not present. Aborting message.");
  }
  const messageType = message.type.toLowerCase();

  switch (messageType) {
    case EventType.IDENTIFY:
      response = await identifyResponseBuilder(message, destination);
      break;
    case EventType.TRACK:
      response = trackResponseBuilder(message, destination);
      break;
    default:
      throw new Error("Message type not supported");
  }
  return response;
};

const process = async event => {
  return await processEvent(event.message, event.destination);
};
exports.process = process;
