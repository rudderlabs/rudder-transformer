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
  getValueFromMessage
} = require("../../util/index");
const {
  MAX_BATCH_SIZE,
  contactDataMapping,
  customEventMapping,
  orderMapping,
  productMapping,
  IDENTIFY_EXCLUSION_FIELDS,
  CUSTOM_EVENT_EXCLUSION_FIELDS,
  ORDER_EXCLUSION_FIELDS,
  PRODUCT_EXCLUSION_FIELDS,
  ENDPOINT,
  MARKETING_OPTIN_LIST
} = require("./config");
const {
  isValidTimestamp,
  createList,
  createAttributeList,
  createListingList
} = require("./util");

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
    payload.properties = [customFields];
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
  if (type === "custom event") {
    payload = constructPayload(message, customEventMapping);
    payload["@type"] = type;
    if (!payload.properties) {
      let customFields = {};
      customFields = extractCustomFields(
        message,
        customFields,
        ["properties"],
        CUSTOM_EVENT_EXCLUSION_FIELDS
      );
      payload.properties = [customFields];
    }
    if (!isValidTimestamp(payload.timestamp)) {
      throw new CustomError("Timestamp format must be ISO-8601", 400);
    }
    if (payload.properties.length < 1) {
      throw new CustomError("Properties field is required", 400);
    }
  } else if (type === "order") {
    payload = constructPayload(message, orderMapping);
    payload["@type"] = type;
    if (!payload.properties) {
      let customFields = {};
      customFields = extractCustomFields(
        message,
        customFields,
        ["properties"],
        ORDER_EXCLUSION_FIELDS
      );
      payload.properties = [customFields];
    }
    if (!isValidTimestamp(payload.timestamp)) {
      throw new CustomError("Timestamp format must be ISO-8601", 400);
    }
    const items = getValueFromMessage(message, "properties.lineitems");
    if (items) {
      const lineitems = createList(items);
      if (lineitems && lineitems.length > 0) {
        payload.lineitems = lineitems;
      }
    }
  } else if (type === "product") {
    payload = constructPayload(message, productMapping);
    payload["@type"] = type;
    if (!payload.properties) {
      let customFields = {};
      customFields = extractCustomFields(
        message,
        customFields,
        ["properties"],
        PRODUCT_EXCLUSION_FIELDS
      );
      payload.properties = [customFields];
    }
    const attributes = getValueFromMessage(message, "properties.attributes");
    if (attributes) {
      const attributeList = createAttributeList(attributes);
      if (attributeList && attributeList.length > 0) {
        payload.attributes = attributeList;
      }
    }
    const listings = getValueFromMessage(message, "properties.listings");
    if (listings) {
      const listingList = createListingList(listings);
      if (listingList && listingList.length > 0) {
        payload.listings = listingList;
      }
    }
  } else {
    throw new CustomError("Invalid Event.", 400);
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
