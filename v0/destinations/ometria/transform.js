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
  isEmptyObject,
  getFieldValueFromMessage
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
const { isValidTimestamp, createList, isValidPhone } = require("./util");

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
  if (payload.phone_number && !isValidPhone(payload.phone_number)) {
    payload.phone_number = null;
    logger.error("Phone number format incorrect.");
  }
  if (payload.channels && payload.channels.sms) {
    if (!payload.phone_number) {
      payload.channels = null;
      logger.error(
        "SMS added in Channel but phone number either invalid or not provided."
      );
    }
  }

  const name = getValueFromMessage(message, [
    "traits.name",
    "context.traits.name"
  ]);
  if (name) {
    const [fName, mName, lName] = name.split(" ");
    payload.firstname = fName || "";
    payload.middlename = mName || "";
    payload.lastname = lName || "";
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
  let event = getValueFromMessage(message, "event");
  if (!event) {
    throw new CustomError("Event name is required for track call.", 400);
  }

  event = event.trim().toLowerCase();
  let payload = {};
  if (ecomEvents.includes(event)) {
    payload = constructPayload(message, orderMapping);
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

    const customer = removeUndefinedAndNullValues({
      id: getFieldValueFromMessage(message, "userId"),
      email: getValueFromMessage(message, [
        "traits.email",
        "context.traits.email"
      ]),
      firstname: getFieldValueFromMessage(message, "firstName"),
      lastname: getFieldValueFromMessage(message, "lastName")
    });
    if (isEmptyObject(customer)) {
      throw new CustomError(
        "Customer object is required for order related event",
        400
      );
    }

    payload.customer = customer;
    payload["@type"] = "order";
    payload.status = eventNameMapping[event];
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
  payload.event_type = event;
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
  const batchedResponse = [];
  const arrayChunks = returnArrayOfSubarrays(destEvents, MAX_BATCH_SIZE);

  arrayChunks.forEach(chunk => {
    const respList = [];
    const metadata = [];

    // extracting the apiKey and destination value
    // from the first event in a batch
    const { destination } = chunk[0];
    const { apiKey } = destination.Config;
    let batchEventResponse = defaultBatchRequestConfig();

    chunk.forEach(ev => {
      respList.push(ev.message.body.JSON[0]);
      metadata.push(ev.metadata);
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
    batchedResponse.push(batchEventResponse);
  });

  return batchedResponse;
};

module.exports = { process, batch };
