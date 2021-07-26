const { EventType } = require("../../../constants");
const {
  getFieldValueFromMessage,
  CustomError,
  defaultRequestConfig,
  extractCustomFields,
  removeUndefinedAndNullValues,
  getErrorRespEvents,
  constructPayload,
  getSuccessRespEvents,
  getDestinationExternalID,
  isEmptyObject,
  defaultPostRequestConfig,
  getValueFromMessage
} = require("../../util");
const logger = require("../../../logger");
const {
  isValidUserIdOrError,
  eventValidity,
  isValidEmail,
  isValidPhone,
  userValidity
} = require("./util");
const {
  ENDPOINT,
  DELIGHTED_EXCLUSION_FIELDS,
  TRACKING_EXCLUSION_FIELDS,
  identifyMapping
} = require("./config");

const identifyResponseBuilder = (message, { Config }) => {
  const userId = getFieldValueFromMessage(message, "userIdOnly");
  if (!userId) {
    throw new CustomError("userId is required for identify", 400);
  }
  let channel =
    getDestinationExternalID(message, "delightedChannelType") || Config.channel;
  channel = channel.toLowerCase();
  const { userIdType, userIdValue } = isValidUserIdOrError(channel, userId);
  let payload = constructPayload(message, identifyMapping);

  payload[userIdType] = userIdValue;

  if (userIdType === "email" && payload.phone_number) {
    if (!isValidPhone(payload.phone_number)) {
      payload.phone_number = null;
      logger.error("Phone number format must be E.164.");
    }
  } else if (userIdType === "sms" && payload.email) {
    if (!isValidEmail(payload.email)) {
      payload.email = null;
      logger.error("Email format is not correct.");
    }
  }

  payload.send = false;
  payload.channel = channel;
  payload.delay = Config.delay || 0;
  if (!payload.name) {
    const fName = getFieldValueFromMessage(message, "firstName");
    const lName = getFieldValueFromMessage(message, "lastName");
    const name = `${fName ? fName.trim() : ""} ${
      lName ? lName.trim() : ""
    }`.trim();
    if (name) {
      payload.name = name;
    }
  }
  payload.last_sent_at = getValueFromMessage(message, [
    "traits.last_sent_at",
    "context.traits.last_sent_at"
  ]);
  let properties = {};
  properties = extractCustomFields(
    message,
    properties,
    ["traits", "context.traits"],
    DELIGHTED_EXCLUSION_FIELDS
  );
  if (!isEmptyObject(properties)) {
    payload = {
      ...payload,
      properties
    };
  }

  const basicAuth = Buffer.from(Config.apiKey).toString("base64");
  const response = defaultRequestConfig();
  response.headers = {
    Authorization: `Basic ${basicAuth}`,
    "Content-Type": "application/json"
  };
  response.method = defaultPostRequestConfig.requestMethod;
  response.endpoint = ENDPOINT;
  response.body.JSON = removeUndefinedAndNullValues(payload);
  return response;
};

const trackResponseBuilder = async (message, { Config }) => {
  // checks if the event is valid if not throws error else nothing
  const isValidEvent = eventValidity(Config, message);
  if (!isValidEvent) {
    throw new CustomError(
      "Event is not configured on your Rudderstack Dashboard",
      400
    );
  }

  const userId = getFieldValueFromMessage(message, "userIdOnly");
  if (!userId) {
    throw new CustomError("userId is required.", 400);
  }
  let channel =
    getDestinationExternalID(message, "delightedChannelType") || Config.channel;
  channel = channel.toLowerCase();

  const { userIdType, userIdValue } = isValidUserIdOrError(channel, userId);

  // checking if user already exists or not, throw error if it doesn't
  const check = await userValidity(channel, Config, userId);

  if (!check) {
    throw new CustomError(`user ${userId} doesnot exist`, 400);
  }
  let payload = {};
  payload[userIdType] = userIdValue;
  payload.send = true;
  payload.channel = channel;
  if (message.properties) {
    payload.delay = parseInt(Config.delay || message.properties.delay || 0, 10);
    payload.last_sent_at = getValueFromMessage(
      message,
      "properties.last_sent_at"
    );
  }
  let properties = {};
  properties = extractCustomFields(
    message,
    properties,
    ["properties"],
    TRACKING_EXCLUSION_FIELDS
  );
  if (!isEmptyObject(properties)) {
    payload = {
      ...payload,
      properties
    };
  }

  const basicAuth = Buffer.from(Config.apiKey).toString("base64");
  const response = defaultRequestConfig();
  response.headers = {
    Authorization: `Basic ${basicAuth}`,
    "Content-Type": "application/json"
  };
  response.method = defaultPostRequestConfig.requestMethod;
  response.endpoint = ENDPOINT;
  response.body.JSON = removeUndefinedAndNullValues(payload);
  return response;
};

const aliasResponseBuilder = (message, { Config }) => {
  let channel =
    getDestinationExternalID(message, "delightedChannelType") || Config.channel;
  channel = channel.toLowerCase();

  const userId = getFieldValueFromMessage(message, "userIdOnly");
  if (!userId) {
    throw new CustomError("userId is required.", 400);
  }
  const payload = {};
  const { previousId } = message;
  if (!previousId) {
    throw new CustomError("Previous Id is required for alias.", 400);
  }
  const emailType =
    channel === "email" && isValidEmail(previousId) && isValidEmail(userId);
  if (emailType) {
    payload.email = previousId;
    payload.email_update = userId;
  }
  const phoneType =
    channel === "sms" && isValidPhone(previousId) && isValidPhone(userId);
  if (phoneType) {
    payload.phone_number = previousId;
    payload.phone_number_update = userId;
  }
  if (!emailType && !phoneType) {
    throw new CustomError(
      "User Id and Previous Id should be of same type i.e. phone/sms",
      400
    );
  }
  const basicAuth = Buffer.from(Config.apiKey).toString("base64");
  const response = defaultRequestConfig();
  response.method = defaultPostRequestConfig.requestMethod;
  response.body.JSON = payload;
  response.headers = {
    Authorization: `Basic ${basicAuth}`,
    "Content-Type": "application/json"
  };
  response.endpoint = ENDPOINT;
  return response;
};

const process = async event => {
  const { message, destination } = event;
  if (!message.type) {
    throw new CustomError(
      "Message Type is not present. Aborting message.",
      400
    );
  }

  if (!destination.Config.apiKey) {
    throw new CustomError("Inavalid API Key. Aborting message.", 400);
  }

  const messageType = message.type.toLowerCase();

  let response;
  switch (messageType) {
    case EventType.IDENTIFY:
      response = identifyResponseBuilder(message, destination);
      break;
    case EventType.TRACK:
      response = await trackResponseBuilder(message, destination);
      break;
    case EventType.ALIAS:
      response = aliasResponseBuilder(message, destination);
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

  const respList = await Promise.all(
    inputs.map(async input => {
      try {
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
