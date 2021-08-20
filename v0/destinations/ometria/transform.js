const logger = require("../../../logger");
const { EventType } = require("../../../constants");
const {
  constructPayload,
  extractCustomFields,
  removeUndefinedAndNullValues,
  defaultBatchRequestConfig,
  returnArrayOfSubarrays,
  defaultPostRequestConfig,
  CustomError,
  defaultRequestConfig,
  getValueFromMessage,
  isEmptyObject
} = require("../../util/index");
const {
  MAX_BATCH_SIZE,
  ecomEvents,
  eventNameMapping,
  contactDataMapping,
  customEventMapping,
  orderMapping,
  currencyList,
  IDENTIFY_EXCLUSION_FIELDS,
  CUSTOM_EVENT_EXCLUSION_FIELDS,
  ORDER_EXCLUSION_FIELDS,
  ENDPOINT,
  MARKETING_OPTIN_LIST
} = require("./config");
const { isValidTimestamp, createList } = require("./util");

const identifyPayloadBuilder = (message, { Config }) => {
  // TODO: validate payload
  const payload = constructPayload(message, contactDataMapping);
  payload["@type"] = "contact";
  if (!payload.properties) {
    let customFields = {};
    customFields = extractCustomFields(
      message,
      customFields,
      ["traits", "context.traits"],
      IDENTIFY_EXCLUSION_FIELDS
    );
    if (!isEmptyObject(customFields)) {
      payload.properties = customFields;
    }
  }
  if (
    payload.marketing_optin &&
    !MARKETING_OPTIN_LIST.includes(payload.marketing_optin)
  ) {
    payload.marketing_optin = null;
  }
  if (payload.channels && payload.channels.sms) {
    if (!payload.phone_number) {
      payload.channels = null;
      logger.error("SMS added in Channel but phone number not provided.");
    }
  }
  const response = defaultRequestConfig();
  response.method = defaultPostRequestConfig.requestMethod;
  response.body.JSON = [removeUndefinedAndNullValues(payload)];
  response.endpoint = ENDPOINT;
  response.headers = {
    "X-Ometria-Auth": Config.apiKey
  };
  return response;
};

const trackResponseBuilder = (message, { Config }) => {
  let type = getValueFromMessage(message, "event");
  if (!type) {
    throw new CustomError("Event name is required for track call.", 400);
  }
  type = type.trim().toLowerCase();
  let payload = {};
  if (ecomEvents.includes(type)) {
    payload = constructPayload(message, orderMapping);
    payload["@type"] = "order";
    payload.status = eventNameMapping[type];
    payload.is_valid = true;
    if (!payload.properties) {
      let customFields = {};
      customFields = extractCustomFields(
        message,
        customFields,
        ["properties"],
        ORDER_EXCLUSION_FIELDS
      );
      if (!isEmptyObject(customFields)) {
        payload.properties = customFields;
      }
    }
    if (!isValidTimestamp(payload.timestamp)) {
      throw new CustomError("Timestamp format must be ISO-8601", 400);
    }
    payload.currency = payload.currency.trim().toUpperCase();
    if (!currencyList.includes(payload.currency)) {
      throw new CustomError(
        "Currency should be only 3 characters and must follow format ISO 4217.",
        400
      );
    }
    const items = getValueFromMessage(message, "properties.products");
    if (items) {
      const lineitems = createList(items);
      if (lineitems && lineitems.length > 0) {
        payload.lineitems = lineitems;
      }
    }
    const response = defaultRequestConfig();
    response.method = defaultPostRequestConfig.requestMethod;
    response.body.JSON = [removeUndefinedAndNullValues(payload)];
    response.endpoint = ENDPOINT;
    response.headers = {
      "X-Ometria-Auth": Config.apiKey
    };
    return response;
  }

  // custom events
  payload = constructPayload(message, customEventMapping);
  payload["@type"] = "custom_event";
  payload.event_type = type;
  if (!payload.properties) {
    let customFields = {};
    customFields = extractCustomFields(
      message,
      customFields,
      ["properties"],
      CUSTOM_EVENT_EXCLUSION_FIELDS
    );
    if (!isEmptyObject(customFields)) {
      payload.properties = customFields;
    }
  }
  if (!isValidTimestamp(payload.timestamp)) {
    throw new CustomError("Timestamp format must be ISO-8601", 400);
  }
  if (!payload.properties) {
    throw new CustomError("Properties field is required", 400);
  }
  const response = defaultRequestConfig();
  response.method = defaultPostRequestConfig.requestMethod;
  response.body.JSON = [removeUndefinedAndNullValues(payload)];
  response.endpoint = ENDPOINT;
  response.headers = {
    "X-Ometria-Auth": Config.apiKey
  };
  return response;
};

/**
 * Processing Single event
 */
const process = event => {
  const { message, destination } = event;
  if (!message.type) {
    throw new CustomError(
      "Message Type is not present. Aborting message.",
      400
    );
  }

  if (!destination.Config.apiKey) {
    throw new CustomError("Invalid api key", 400);
  }

  const messageType = message.type.toLowerCase();

  let response;
  switch (messageType) {
    case EventType.IDENTIFY:
      response = identifyPayloadBuilder(message, destination);
      break;
    case EventType.TRACK:
      response = trackResponseBuilder(message, destination);
      break;
    default:
      throw new CustomError(`message type ${messageType} not supported`, 400);
  }
  return response;
};

const batch = destEvents => {
  const respList = [];
  const metadata = [];
  let batchEventResponse = defaultBatchRequestConfig();
  const { destination } = destEvents[0];
  const { apiKey } = destination.Config;

  const arrayChunks = returnArrayOfSubarrays(destEvents, MAX_BATCH_SIZE);
  arrayChunks.forEach(chunk => {
    respList.push(chunk[0].message.body.JSON[0]);
    metadata.push(chunk[0].metadata);
  });

  batchEventResponse.batchedRequest.body.JSON = respList;
  batchEventResponse.batchedRequest.endpoint = ENDPOINT;
  batchEventResponse.batchedRequest.headers = {
    "X-Ometria-Auth": apiKey
  };
  batchEventResponse = {
    ...batchEventResponse,
    metadata,
    destination
  };

  return [batchEventResponse];
};

module.exports = { process, batch };
