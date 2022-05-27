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
  CustomError,
  getErrorRespEvents,
  getSuccessRespEvents,
  isDefinedAndNotNullAndNotEmpty
} = require("../../util");
const {
  getDestinationItemProperties,
  getExternalIdentifiersMapping,
  getUserExistence,
  getPropertiesKeyValidation,
  validateTimestamp
} = require("./util");

const responseBuilder = (payload, apiKey, endpoint) => {
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

const identifyResponseBuilder = (message, { Config }) => {
  const { apiKey } = Config;
  let { signUpSourceId } = Config;
  let endpoint, payload;
  const integrationsObj = getIntegrationsObj(message, "attentive_tag");
  if (integrationsObj) {
    // Overriding signupSourceId if present in integrations object
    if (integrationsObj.signUpSourceId) {
      signUpSourceId = integrationsObj.signUpSourceId;
    }
    if (integrationsObj.identifyOperation?.toLowerCase() === "unsubscribe") {
      endpoint = "/subscriptions/unsubscribe";
      payload = constructPayload(
        message,
        mappingConfig[ConfigCategory.IDENTIFY.name]
      );

      /**
       * Structure we are expecting:
       *  "subscriptions": [
       *    {
       *        "type": "MARKETING" || "TRANSACTIONAL" || "CHECKOUT_ABANDONED"
       *        "channel": "TEXT" || "EMAIL"
       *    }
       * ],
       *  "notification":
       *    {
       *        "language": "en-US" || "fr-CA"
       *    }
       */
      const { subscriptions, notification } = integrationsObj;
      payload = {
        ...payload,
        subscriptions,
        notification
      };
    }
  }
  // If the identify request is not for unsubscribe
  if (!payload) {
    endpoint = "/subscriptions";
    payload = constructPayload(
      message,
      mappingConfig[ConfigCategory.IDENTIFY.name]
    );
    if (!signUpSourceId) {
      throw new CustomError(
        "[Attentive Tag]: SignUp Source Id is required for subscribe event"
      );
    }
    payload = {
      ...payload,
      signUpSourceId,
      externalIdentifiers: getExternalIdentifiersMapping(message)
    };
  }
  if (
    !payload.user ||
    (!isDefinedAndNotNullAndNotEmpty(payload.user.email) &&
      !isDefinedAndNotNullAndNotEmpty(payload.user.phone))
  ) {
    throw new CustomError(
      "[Attentive Tag] :: Either email or phone is required",
      400
    );
  }
  return responseBuilder(payload, apiKey, endpoint);
};

const trackResponseBuilder = (message, { Config }) => {
  const { apiKey } = Config;
  let endpoint;
  let event = get(message, "event");
  if (!event) {
    throw new CustomError("[Attentive Tag] :: Event name is not present", 400);
  }
  if (!validateTimestamp(getFieldValueFromMessage(message, "timestamp"))) {
    throw new CustomError(
      "[Attentive_Tag]: Events must be sent within 12 hours of their occurrence.",
      400
    );
  }
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
      payload.externalIdentifiers = getExternalIdentifiersMapping(message);
      break;
    /* Ordering Section */
    case "product_viewed":
      payload = constructPayload(
        message,
        mappingConfig[ConfigCategory.PRODUCT_VIEWED.name]
      );
      endpoint = ConfigCategory.PRODUCT_VIEWED.endpoint;
      payload.items = getDestinationItemProperties(message, true);
      payload.externalIdentifiers = getExternalIdentifiersMapping(message);
      break;
    case "order_completed":
      payload = constructPayload(
        message,
        mappingConfig[ConfigCategory.ORDER_COMPLETED.name]
      );
      endpoint = ConfigCategory.ORDER_COMPLETED.endpoint;
      payload.items = getDestinationItemProperties(message, true);
      payload.externalIdentifiers = getExternalIdentifiersMapping(message);
      break;
    case "product_added":
      payload = constructPayload(
        message,
        mappingConfig[ConfigCategory.PRODUCT_ADDED.name]
      );
      endpoint = ConfigCategory.PRODUCT_ADDED.endpoint;
      payload.items = getDestinationItemProperties(message, true);
      payload.externalIdentifiers = getExternalIdentifiersMapping(message);
      break;
    default:
      payload = constructPayload(
        message,
        mappingConfig[ConfigCategory.TRACK.name]
      );
      endpoint = ConfigCategory.TRACK.endpoint;
      payload.type = get(message, "event");
      if (!getPropertiesKeyValidation(payload)) {
        throw new CustomError(
          "[Attentive Tag]:The event name contains characters which is not allowed",
          400
        );
      }
      payload.externalIdentifiers = getExternalIdentifiersMapping(message);
  }

  if (
    !payload.user ||
    (!isDefinedAndNotNullAndNotEmpty(payload.user.email) &&
      !isDefinedAndNotNullAndNotEmpty(payload.user.phone))
  ) {
    throw new CustomError(
      "[Attentive Tag] :: Either email or phone is required",
      400
    );
  }
  return responseBuilder(payload, apiKey, endpoint);
};

const processEvent = (message, destination) => {
  if (!message.type) {
    throw new CustomError(
      "Message Type is not present. Aborting message.",
      400
    );
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
      throw new CustomError("Message type not supported", 400);
  }
  return response;
};

const process = event => {
  return processEvent(event.message, event.destination);
};

const processRouterDest = inputs => {
  if (!Array.isArray(inputs) || inputs.length <= 0) {
    const respEvents = getErrorRespEvents(null, 400, "Invalid event array");
    return [respEvents];
  }

  const respList = Promise.all(
    inputs.map(async input => {
      try {
        if (input.message.statusCode) {
          // already transformed event
          return getSuccessRespEvents(
            input.message,
            [input.metadata],
            input.destination
          );
        }
        // if not transformed
        return getSuccessRespEvents(
          process(input),
          [input.metadata],
          input.destination
        );
      } catch (error) {
        return getErrorRespEvents(
          [input.metadata],
          error.response
            ? error.response.status
            : error.code
            ? error.code
            : 400,
          error.message || "Error occurred while processing payload."
        );
      }
    })
  );
  return respList;
};

module.exports = { process, processRouterDest };
