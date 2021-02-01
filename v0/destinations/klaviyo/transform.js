/* eslint-disable  array-callback-return */
const get = require("get-value");
const axios = require("axios");
const logger = require("../../../logger");
const { EventType } = require("../../../constants");
const {
  CONFIG_CATEGORIES,
  BASE_ENDPOINT,
  MAPPING_CONFIG,
  LIST_SUBSCRIBE_URL
} = require("./config");
const {
  defaultRequestConfig,
  constructPayload,
  getFieldValueFromMessage,
  defaultGetRequestConfig,
  extractCustomFields,
  removeUndefinedValues
} = require("../../util");

const identifyRequestHandler = async (message, category, destination) => {
  const subscribeUrl = `${BASE_ENDPOINT}${LIST_SUBSCRIBE_URL}`.replace(
    "###",
    get(message.properties, "listId")
  );
  let profile = {
    email: getFieldValueFromMessage(message, "email"),
    phone_number: getFieldValueFromMessage(message, "phone")
  };
  profile = removeUndefinedValues(profile);
  try {
    const res = await axios.post(
      subscribeUrl,
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
    if (res.status !== 200) logger.error("Unable to Subscribe User to List");
  } catch (err) {
    logger.error(err);
  }

  let propertyPayload = constructPayload(
    message,
    MAPPING_CONFIG[category.name]
  );
  propertyPayload = extractCustomFields(
    message,
    propertyPayload,
    ["traits", "context.traits"],
    [
      "email",
      "firstName",
      "lastName",
      "phone",
      "title",
      "organization",
      "city",
      "region",
      "country",
      "zip",
      "image",
      "timezone",
      "anonymousId",
      "userId"
    ]
  );
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

const trackRequestHandler = (message, category, destination) => {
  const payload = constructPayload(message, MAPPING_CONFIG[category.name]);
  payload.token = destination.Config.publicApiKey;
  payload.customer_properties = {
    $email: getFieldValueFromMessage(message, "email"),
    $phone_number: getFieldValueFromMessage(message, "phone")
  };
  const encodedData = Buffer.from(JSON.stringify(payload)).toString("base64");
  const response = defaultRequestConfig();
  response.endpoint = `${BASE_ENDPOINT}${category.apiUrl}?data=${encodedData}`;
  response.method = defaultGetRequestConfig.requestMethod;
  return response;
};

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
