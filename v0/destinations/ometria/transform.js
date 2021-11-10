/* eslint-disable one-var */
/* eslint-disable camelcase */
const set = require("set-value");
const { EventType } = require("../../../constants");
const {
  constructPayload,
  extractCustomFields,
  removeUndefinedAndNullValues,
  returnArrayOfSubarrays,
  defaultPostRequestConfig,
  CustomError,
  defaultRequestConfig,
  getValueFromMessage,
  isEmptyObject,
  getFieldValueFromMessage,
  getIntegrationsObj,
  getErrorRespEvents,
  getSuccessRespEvents
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
const {
  isValidTimestamp,
  createLineItems,
  addressMappper,
  contactPayloadValidator
} = require("./util");

const identifyResponseBuilder = (message, { Config }) => {
  let payload = constructPayload(message, contactDataMapping);
  payload = contactPayloadValidator(payload);

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

  let { marketingOptin, allowMarketing, allowTransactional } = Config;
  let dt_updated_marketing, dt_updated_transactional;

  const integrationsObj = getIntegrationsObj(message, "ometria");
  if (integrationsObj) {
    if (
      integrationsObj.marketingOptin &&
      MARKETING_OPTIN_LIST.includes(integrationsObj.marketingOptin)
    ) {
      marketingOptin = integrationsObj.marketingOptin;
    }
    if (integrationsObj.listingId) {
      payload.id = integrationsObj.listingId;
    }

    allowMarketing = integrationsObj.allowMarketing || allowMarketing;
    allowTransactional =
      integrationsObj.allowTransactional || allowTransactional;
    if (
      integrationsObj.dt_updated_marketing &&
      isValidTimestamp(integrationsObj.dt_updated_marketing)
    ) {
      dt_updated_marketing = integrationsObj.dt_updated_marketing;
    }
    if (
      integrationsObj.dt_updated_transactional &&
      isValidTimestamp(integrationsObj.dt_updated_transactional)
    ) {
      dt_updated_transactional = integrationsObj.dt_updated_transactional;
    }
  }

  if (!payload.id) {
    throw new CustomError("listingId is required for identify", 400);
  }
  payload.marketing_optin = marketingOptin;
  payload.channels = {
    sms: removeUndefinedAndNullValues({
      dt_updated_marketing,
      dt_updated_transactional,
      allow_marketing: allowMarketing,
      allow_transactional: allowTransactional
    })
  };

  const name = getValueFromMessage(message, [
    "traits.name",
    "context.traits.name"
  ]);
  if (name) {
    const splitArr = name.split(" ");
    const [fName, mName, lName] = splitArr;
    if (splitArr && splitArr.length <= 2) {
      payload.firstname = fName || null;
      payload.lastname = mName || null;
    } else {
      payload.firstname = fName || null;
      payload.middlename = mName || null;
      payload.lastname = lName || null;
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
        "currency should be only 3 characters and must follow format ISO 4217.",
        400
      );
    }

    const customer = removeUndefinedAndNullValues({
      id: getFieldValueFromMessage(message, "userId"),
      email: getValueFromMessage(message, [
        "traits.email",
        "context.traits.email",
        "properties.email"
      ]),
      firstname: getFieldValueFromMessage(message, "firstName"),
      lastname: getFieldValueFromMessage(message, "lastName")
    });
    if (!customer.id || !customer.email) {
      throw new CustomError(
        "customer_id and email is required for order related event.",
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
      const lineitems = createLineItems(items);
      if (lineitems && lineitems.length > 0) {
        payload.lineitems = lineitems;
      }
    }
    if (payload.billing_address) {
      payload.billing_address = addressMappper(payload.billing_address);
    }
    if (payload.shipping_address) {
      payload.shipping_address = addressMappper(payload.shipping_address);
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
  if (!isValidTimestamp(payload.timestamp)) {
    throw new CustomError("Timestamp format must be ISO-8601", 400);
  }
  if (!payload.id) {
    payload.id = message.messageId;
  }
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
    payload.properties = customFields;
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
      "message Type is not present. Aborting message.",
      400
    );
  }

  if (!destination.Config.apiKey) {
    throw new CustomError("Invalid Api Key", 400);
  }

  const messageType = message.type.toLowerCase();

  let response;
  switch (messageType) {
    case EventType.IDENTIFY:
      response = identifyResponseBuilder(message, destination);
      break;
    case EventType.TRACK:
      response = trackResponseBuilder(message, destination);
      break;
    default:
      throw new CustomError(`message type ${messageType} not supported`, 400);
  }
  return response;
};

const processRouterDest = async inputs => {
  if (!Array.isArray(inputs) || inputs.length <= 0) {
    const respEvents = getErrorRespEvents(null, 400, "Invalid event array");
    return [respEvents];
  }
  const inputChunks = returnArrayOfSubarrays(inputs, MAX_BATCH_SIZE);
  const successList = [];
  const errorList = [];
  inputChunks.forEach(chunk => {
    const eventsList = [];
    const metadataList = [];

    // using the first destination config in chunk for transforming the events in one
    // chunk into a batch
    const { destination } = chunk[0];
    chunk.forEach(async input => {
      try {
        set(input, "destination", destination);
        // input.destination = destination;
        const transformedEvent = process(input);
        eventsList.push(...transformedEvent.body.JSON);
        metadataList.push(input.metadata);
      } catch (error) {
        errorList.push(
          getErrorRespEvents(
            [input.metadata],
            error.response
              ? error.response.status
              : error.code
              ? error.code
              : 400,
            error.message || "Error occurred while processing payload."
          )
        );
      }
    });

    if (eventsList.length !== 0) {
      // setting up the batched request json here
      const batchedRequest = defaultRequestConfig();
      batchedRequest.endpoint = ENDPOINT;
      batchedRequest.headers = {
        "X-Ometria-Auth": destination.Config.apiKey
      };
      batchedRequest.body.JSON_ARRAY = { batch: JSON.stringify(eventsList) };
      successList.push(
        getSuccessRespEvents(batchedRequest, metadataList, destination, true)
      );
    }
  });
  return [...errorList, ...successList];
};

module.exports = { process, processRouterDest };
