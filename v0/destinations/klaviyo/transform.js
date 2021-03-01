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
  removeUndefinedAndNullValues
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
  try {
    const res = await axios.post(
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
    if (res.status !== 200) logger.debug("Unable to add User to List");
  } catch (err) {
    logger.debug(err);
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
  const traitsInfo = message.traits ? message.traits : message.context.traits;
  if (
    (!!destination.Config.listId || !!get(traitsInfo.properties, "listId")) &&
    destination.Config.privateApiKey
  ) {
    addUserToList(message, traitsInfo, LIST_CONF.MEMBERSHIP, destination);
    if (get(traitsInfo.properties, "subscribe") === true)
      addUserToList(message, traitsInfo, LIST_CONF.SUBSCRIBE, destination);
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

  propertyPayload.$first_name = getFieldValueFromMessage(message, "firstName");
  propertyPayload.$last_name = getFieldValueFromMessage(message, "lastName");
  propertyPayload.$id = getFieldValueFromMessage(message, "userId");
  // Extract other K-V property from traits about user custom properties
  propertyPayload = extractCustomFields(
    message,
    propertyPayload,
    ["traits", "context.traits"],
    WhiteListedTraits
  );
  propertyPayload = removeUndefinedAndNullValues(propertyPayload);
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
  customerProperties.$first_name = getFieldValueFromMessage(
    message,
    "firstName"
  );
  customerProperties.$last_name = getFieldValueFromMessage(message, "lastName");
  customerProperties.$id = getFieldValueFromMessage(message, "userId");
  // Extract other K-V property from traits about user custom properties
  customerProperties = extractCustomFields(
    message,
    customerProperties,
    ["traits", "context.traits"],
    WhiteListedTraits
  );
  customerProperties = removeUndefinedAndNullValues(customerProperties);
  payload.customer_properties = customerProperties;
  if (message.timestamp) payload.time = toUnixTimestamp(message.timestamp);
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
  profile.first_name = getFieldValueFromMessage(message, "firstName");
  profile.last_name = getFieldValueFromMessage(message, "lastName");
  profile.$id = getFieldValueFromMessage(message, "userId");
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
  if (get(message.traits, "subscribe") === true) {
    // If consent info not present draw it from dest config
    if (!profile.sms_consent)
      profile.sms_consent = destination.Config.smsConsent;
    if (!profile.$consent) profile.$consent = destination.Config.consent;
    try {
      const res = await axios.post(
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
      if (res.status !== 200) logger.debug("Unable to add User to List");
    } catch (err) {
      logger.debug(err);
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
    throw Error("Message Type is not present. Aborting message.");
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
      throw new Error("Message type not supported");
  }
  return response;
};

const process = async event => {
  const result = await processEvent(event.message, event.destination);
  return result;
};

exports.process = process;
