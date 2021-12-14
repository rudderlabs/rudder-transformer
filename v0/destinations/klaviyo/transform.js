/* eslint-disable no-nested-ternary */
/* eslint-disable no-underscore-dangle */
/* eslint-disable  array-callback-return */
const get = require("get-value");
const axios = require("axios");
const logger = require("../../../logger");
const { EventType, WhiteListedTraits } = require("../../../constants");
const {
  CONFIG_CATEGORIES,
  BASE_ENDPOINT,
  MAPPING_CONFIG,
  LIST_CONF
} = require("./config");
const {
  defaultRequestConfig,
  constructPayload,
  getFieldValueFromMessage,
  defaultGetRequestConfig,
  defaultPostRequestConfig,
  extractCustomFields,
  removeUndefinedValues,
  toUnixTimestamp,
  removeUndefinedAndNullValues,
  getSuccessRespEvents,
  getErrorRespEvents,
  CustomError
} = require("../../util");

// A sigle func to handle the addition of user to a list
// from an identify call.
// DOCS: https://www.klaviyo.com/docs/api/v2/lists
const addUserToList = async (message, traitsInfo, conf, destination) => {
  // Check if list Id is present in message properties, if yes override
  let targetUrl = `${BASE_ENDPOINT}/api/v2/list/${destination.Config.listId}`;
  if (get(traitsInfo.properties, "listId")) {
    targetUrl = `${BASE_ENDPOINT}/api/v2/list/${get(
      traitsInfo.properties,
      "listId"
    )}`;
  }
  let profile = {
    id: getFieldValueFromMessage(message, "userId"),
    email: getFieldValueFromMessage(message, "email"),
    phone_number: getFieldValueFromMessage(message, "phone")
  };
  if (destination.Config.enforceEmailAsPrimary) {
    delete profile.id;
    profile._id = getFieldValueFromMessage(message, "userId");
  }
  // If func is called as membership func else subscribe func
  if (conf === LIST_CONF.MEMBERSHIP) {
    targetUrl = `${targetUrl}/members`;
  } else {
    // get consent statuses from message if availabe else from dest config
    targetUrl = `${targetUrl}/subscribe`;
    profile.sms_consent = get(traitsInfo.properties, "smsConsent")
      ? get(traitsInfo.properties, "smsConsent")
      : destination.Config.smsConsent;
    profile.$consent = get(traitsInfo.properties, "consent")
      ? get(traitsInfo.properties, "consent")
      : destination.Config.consent;
  }
  profile = removeUndefinedValues(profile);
  // send network request
  try {
    await axios.post(
      targetUrl,
      {
        api_key: destination.Config.privateApiKey,
        profiles: [profile]
      },
      {
        headers: {
          "Content-Type": "application/json"
        }
      }
    );
  } catch (err) {
    logger.debug("[Klaviyo :: addToList]", err);
  }
};

// ---------------------
// Main Identify request handler func
// internally it uses axios if membership and(or)
// subscription is enabled for that user to
// specific List.
// DOCS: https://www.klaviyo.com/docs/http-api
// ---------------------
const identifyRequestHandler = async (message, category, destination) => {
  // If listId property is present try to subscribe/member user in list
  const traitsInfo = getFieldValueFromMessage(message, "traits");
  if (
    (!!destination.Config.listId || !!get(traitsInfo.properties, "listId")) &&
    destination.Config.privateApiKey
  ) {
    await addUserToList(message, traitsInfo, LIST_CONF.MEMBERSHIP, destination);
    if (get(traitsInfo.properties, "subscribe") === true) {
      await addUserToList(
        message,
        traitsInfo,
        LIST_CONF.SUBSCRIBE,
        destination
      );
    }
  } else {
    logger.info(
      `Cannot process list operation as listId is not available, either in message or config, or private key not present`
    );
  }
  // actual identify call
  let propertyPayload = constructPayload(
    message,
    MAPPING_CONFIG[category.name]
  );
  // Extract other K-V property from traits about user custom properties
  propertyPayload = extractCustomFields(
    message,
    propertyPayload,
    ["traits", "context.traits"],
    WhiteListedTraits
  );
  propertyPayload = removeUndefinedAndNullValues(propertyPayload);
  if (destination.Config.enforceEmailAsPrimary) {
    delete propertyPayload.$id;
    propertyPayload._id = getFieldValueFromMessage(message, "userId");
  }
  const payload = {
    token: destination.Config.publicApiKey,
    properties: propertyPayload
  };
  const encodedData = Buffer.from(JSON.stringify(payload)).toString("base64");
  const response = defaultRequestConfig();
  response.endpoint = `${BASE_ENDPOINT}${category.apiUrl}?data=${encodedData}`;
  response.method = defaultGetRequestConfig.requestMethod;
  return response;
};

// ----------------------
// Main handler func for track request/screen request
// User info needs to be mapped to a track event (mandatory)
// DOCS: https://www.klaviyo.com/docs/http-api
// ----------------------
const trackRequestHandler = (message, category, destination) => {
  const payload = constructPayload(message, MAPPING_CONFIG[category.name]);
  payload.token = destination.Config.publicApiKey;
  if (message.properties && message.properties.revenue) {
    payload.properties.$value = message.properties.revenue;
    delete payload.properties.revenue;
  }
  let customerProperties = constructPayload(
    message,
    MAPPING_CONFIG[CONFIG_CATEGORIES.IDENTIFY.name]
  );
  // Extract other K-V property from traits about user custom properties
  customerProperties = extractCustomFields(
    message,
    customerProperties,
    ["traits", "context.traits"],
    WhiteListedTraits
  );
  customerProperties = removeUndefinedAndNullValues(customerProperties);
  if (destination.Config.enforceEmailAsPrimary) {
    delete customerProperties.$id;
    customerProperties._id = getFieldValueFromMessage(message, "userId");
  }
  payload.customer_properties = customerProperties;
  if (message.timestamp) {
    payload.time = toUnixTimestamp(message.timestamp);
  }
  const encodedData = Buffer.from(JSON.stringify(payload)).toString("base64");
  const response = defaultRequestConfig();
  response.endpoint = `${BASE_ENDPOINT}${category.apiUrl}?data=${encodedData}`;
  response.method = defaultGetRequestConfig.requestMethod;
  return response;
};

// ----------------------
// Main handlerfunc for group request
// we will map user to list (subscribe and/or member)
// based on property sent
// DOCS: https://www.klaviyo.com/docs/api/v2/lists
// ----------------------
const groupRequestHandler = async (message, category, destination) => {
  const targetUrl = `${BASE_ENDPOINT}/api/v2/list/${get(
    message,
    "groupId"
  )}/subscribe`;
  let profile = constructPayload(message, MAPPING_CONFIG[category.name]);
  // Extract other K-V property from traits about user custom properties
  const groupWhitelistedTraits = [
    ...WhiteListedTraits,
    ...["consent", "smsConsent", "subscribe"]
  ];
  profile = extractCustomFields(
    message,
    profile,
    ["traits", "context.traits"],
    groupWhitelistedTraits
  );
  profile = removeUndefinedAndNullValues(profile);
  if (destination.Config.enforceEmailAsPrimary) {
    delete profile.$id;
    profile._id = getFieldValueFromMessage(message, "userId");
  }
  if (get(message.traits, "subscribe") === true) {
    // If consent info not present draw it from dest config
    if (!profile.sms_consent) {
      profile.sms_consent = destination.Config.smsConsent;
    }
    if (!profile.$consent) {
      profile.$consent = destination.Config.consent;
    }
    // send network request
    try {
      await axios.post(
        targetUrl,
        {
          api_key: destination.Config.privateApiKey,
          profiles: [profile]
        },
        {
          headers: {
            "Content-Type": "application/json"
          }
        }
      );
    } catch (err) {
      logger.debug("[Klaviyo :: groupRequestHandler (addToList)", err);
    }
  }
  delete profile.sms_consent;
  delete profile.$consent;
  const payload = {
    api_key: destination.Config.privateApiKey,
    profiles: [profile]
  };
  const response = defaultRequestConfig();
  response.endpoint = `${BASE_ENDPOINT}/api/v2/list/${get(
    message,
    "groupId"
  )}/members`;
  response.headers = {
    "Content-Type": "application/json"
  };
  response.body.JSON = payload;
  response.method = defaultPostRequestConfig.requestMethod;
  return response;
};

// Main event processor using specific handler funcs
const processEvent = async (message, destination) => {
  if (!message.type) {
    throw new CustomError(
      "Message Type is not present. Aborting message.",
      400
    );
  }
  const messageType = message.type.toLowerCase();

  let category;
  let response;
  switch (messageType) {
    case EventType.IDENTIFY:
      category = CONFIG_CATEGORIES.IDENTIFY;
      response = await identifyRequestHandler(message, category, destination);
      break;
    case EventType.SCREEN:
    case EventType.TRACK:
      category = CONFIG_CATEGORIES.TRACK;
      response = trackRequestHandler(message, category, destination);
      break;
    case EventType.GROUP:
      category = CONFIG_CATEGORIES.GROUP;
      response = await groupRequestHandler(message, category, destination);
      break;
    default:
      throw new CustomError("Message type not supported", 400);
  }
  return response;
};

const process = async event => {
  const result = await processEvent(event.message, event.destination);
  return result;
};

const processRouterDest = async inputs => {
  if (!Array.isArray(inputs) || inputs.length <= 0) {
    const respEvents = getErrorRespEvents(null, 400, "Invalid event array");
    return [respEvents];
  }

  const respList = await Promise.all(
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
          await process(input),
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
