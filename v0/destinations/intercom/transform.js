const set = require("set-value");
const { EventType } = require("../../../constants");
const {
  constructPayload,
  removeUndefinedAndNullValues,
  defaultRequestConfig,
  defaultPostRequestConfig,
  getFieldValueFromMessage,
  getDestinationExternalID
} = require("../../util");
const { ENDPOINTS, identifyDataMapping } = require("./config");
const { searchUser, CustomError } = require("./util");

const identifyResponseBuilder = async (message, { Config }) => {
  const externalUserId = getDestinationExternalID(message, "intercomUserId");
  const userId = getFieldValueFromMessage(message, "userIdOnly");
  const email = getFieldValueFromMessage(message, "email");

  let destUserId;
  if (externalUserId) {
    destUserId = externalUserId;
  } else if (userId) {
    destUserId = await searchUser("external_id", userId);
  } else if (email) {
    destUserId = await searchUser("email", email);
  } else {
    throw new CustomError(
      "externalId, userId or email is required for identify",
      400
    );
  }

  const payload = constructPayload(message, identifyDataMapping);
  if (!payload.name) {
    const fName = getFieldValueFromMessage(message, "firstName");
    const lName = getFieldValueFromMessage(message, "lastName");
    set(payload, "name", `${fName} ${lName}`.trim());
  }

  const response = defaultRequestConfig();
  response.endpoint = ENDPOINTS.IDENTIFY_ENDPOINT;
  response.headers = {
    Authorization: `Bearer ${Config.apiToken}`
  };

  // update existing User
  if (destUserId) {
    delete payload.signed_up_at;

    response.method = defaultPutRequestConfig.requestMethod;
    response.body.JSON = removeUndefinedAndNullValues(payload);
    return response;
  }

  // create new User
  set(payload, "email", email);
  set(payload, "external_id", userId);

  response.method = defaultPostRequestConfig.requestMethod;
  response.body.JSON = removeUndefinedAndNullValues(payload);
  return response;
};

// process single message
const process = async event => {
  if (!message || !message.type) {
    throw CustomError("Message Type is not present. Aborting message.", 400);
  }
  if (!Config.apiToken) {
    throw new CustomError("API Token is missing.", 400);
  }

  const { message, destination } = event;
  const messageType = getValueFromMessage(message, "type")
    .toLowerCase()
    .trim();

  let response;
  switch (messageType) {
    case EventType.IDENTIFY:
      response = await identifyResponseBuilder(message, destination);
      break;
    default:
      throw new CustomError(`message type ${messageType} not supported`, 400);
  }
  return response;
};

exports.process = process;
