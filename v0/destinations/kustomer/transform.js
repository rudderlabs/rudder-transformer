const get = require("get-value");
const axios = require("axios");
const { EventType } = require("../../../constants");
const logger = require("../../../logger");
const {
  CONFIG_CATEGORIES,
  MAPPING_CONFIG,
  BASE_ENDPOINT
} = require("./config");
const {
  defaultRequestConfig,
  getFieldValueFromMessage,
  constructPayload,
  removeUndefinedAndNullValues,
  defaultPostRequestConfig,
  defaultPutRequestConfig
} = require("../../util");
const { validateEvent } = require("./util");

// Function responsible for constructing the Kustomer (User) Payload for identify
// type of events.
const constructKustomerPayload = (message, category) => {
  const kustomerPayload = constructPayload(
    message,
    MAPPING_CONFIG[category.name]
  );
  if (getFieldValueFromMessage(message, "email")) {
    kustomerPayload.emails = kustomerPayload.emails
      ? kustomerPayload.emails
      : [{ type: "home", email: getFieldValueFromMessage(message, "email") }];
  }

  if (getFieldValueFromMessage(message, "phone")) {
    kustomerPayload.phones = kustomerPayload.phones
      ? kustomerPayload.phones
      : [{ type: "home", phone: getFieldValueFromMessage(message, "phone") }];
  }
  const url = get(message, "traits.website")
    ? get(message, "traits.website")
    : get(message, "context.traits.website");
  if (url) {
    kustomerPayload.urls = [
      {
        url
      }
    ];
  }

  const address = getFieldValueFromMessage(message, "address");
  if (address) {
    kustomerPayload.locations = [
      {
        type: "home",
        address:
          typeof address === "string"
            ? address
            : `${address.street}, ${address.city}, ${address.state}, ${address.postalCode}`
      }
    ];
  }

  removeUndefinedAndNullValues(kustomerPayload);
  return kustomerPayload;
};

// Main process function responsible for building payload for all
// type of events.
const responseBuilderSimple = async (message, category, destination) => {
  let payload = {};
  let targetUrl = BASE_ENDPOINT;
  let userExists = false;
  // In case of identify type of event first extract the anonymousId, userId
  // and search if any Kustomer is present in destination.
  // If present update the same kustomer with the given payload.
  // else create a new kustomer.
  //-------------------------------------------------------------
  // Get Kustomer: https://apidocs.kustomer.com/#ff41f372-6144-4c64-9712-662ee5ef1c33
  // Create Kustomer: https://apidocs.kustomer.com/#07bd1072-4d4b-4875-b526-8369d711e811
  // Update Kustomer: https://apidocs.kustomer.com/#077d653a-184e-4153-8133-d24b6427c1ae
  if (message.type.toLowerCase() == EventType.IDENTIFY) {
    const idArr = [
      get(message, "anonymousId"),
      getFieldValueFromMessage(message, "userIdOnly")
    ];
    let response;
    await Promise.all(
      idArr.map(async id => {
        try {
          response = await axios.get(
            `${BASE_ENDPOINT}/v1/customers/externalId=${id}`,
            {
              headers: {
                Authorization: `Bearer ${destination.Config.apiKey}`
              }
            }
          );
        } catch (err) {
          logger.debug("Error while fetching customer info");
        }
        // If Kustomer Exists url to user : Update kustomer
        if (response && response.status === 200) {
          userExists = true;
          targetUrl = `${targetUrl}/v1/customers/${response.data.data.id}?replace=false`;
        }
      })
    );
    // URL to use for creating new Kustomer
    if (!userExists) {
      targetUrl = `${targetUrl}/v1/customers`;
    }
    payload = constructKustomerPayload(message, category);
  }
  // Section responsible for handling screen, page, and track type of
  // events. An userId, or anonymous id of the user who is already
  // identified is required for logging events into their timeline.
  // -----------------------------------------------------------
  // Ref: https://apidocs.kustomer.com/#fe1b29a6-7f3c-40a7-8f54-973ecd0335e8
  // Ref: https://apidocs.kustomer.com/#0b0da19f-fca2-401d-af78-5d054c75a9b2
  else {
    targetUrl = `${targetUrl}/v1/tracking/identityEvent`;
    const eventPayload = constructPayload(
      message,
      MAPPING_CONFIG[category.name]
    );
    removeUndefinedAndNullValues(eventPayload);
    validateEvent(eventPayload);
    payload = {
      identity: {
        externalId: getFieldValueFromMessage(message, "userId")
      },
      event: eventPayload
    };
  }
  if (payload) {
    const responseBody = { ...payload };
    const response = defaultRequestConfig();
    response.endpoint = targetUrl;
    response.method = userExists
      ? defaultPutRequestConfig.requestMethod
      : defaultPostRequestConfig.requestMethod;
    response.headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${destination.Config.apiKey}`
    };
    response.body.JSON = responseBody;
    return response;
  }
  // fail-safety for developer error
  throw new Error("Payload could not be constructed");
};

const processEvent = (message, destination) => {
  if (!message.type) {
    throw Error("Message Type is not present. Aborting message.");
  }
  const messageType = message.type.toLowerCase();

  let category;
  switch (messageType) {
    case EventType.IDENTIFY:
      category = CONFIG_CATEGORIES.IDENTIFY;
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
  return responseBuilderSimple(message, category, destination);
};

const process = event => {
  return processEvent(event.message, event.destination);
};

exports.process = process;
