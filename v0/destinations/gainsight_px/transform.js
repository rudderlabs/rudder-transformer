/* eslint-disable prettier/prettier */
/* eslint-disable no-nested-ternary */
const { EventType } = require("../../../constants");
const {
  constructPayload,
  defaultRequestConfig,
  extractCustomFields,
  defaultPutRequestConfig,
  removeUndefinedAndNullValues,
  defaultPostRequestConfig,
  getSuccessRespEvents,
  getErrorRespEvents,
  getHashFromArray,
  getFieldValueFromMessage,
  getValueFromMessage
} = require("../../util/index");
const {
  CustomError,
  userExists,
  renameCustomFields,
  getProductTagKeys,
  removeKeysFromPayload
} = require("./util");
const {
  identifyMapping,
  ENDPOINTS,
  USER_EXCLUSION_FIELDS
} = require("./config");

const identifyResponseBuilder = async (message, propertyKeys, { Config }) => {
  const userId = getFieldValueFromMessage(message, "userIdOnly");
  if (!userId) {
    throw new CustomError("userId is required for identify", 400);
  }

  const response = defaultRequestConfig();
  response.headers = {
    "X-APTRINSIC-API-KEY": Config.apiKey,
    "Content-Type": "application/json"
  };

  const isPresent = await userExists(userId, Config);

  let payload = constructPayload(message, identifyMapping);
  const name = getValueFromMessage(message, [
    "traits.name",
    "context.traits.name"
  ]);
  if (name && typeof name === "string") {
    const [fName, lName] = name.split(" ");
    payload.firstName = fName;
    payload.lastName = lName;
  }
  let customAttributes = {};
  customAttributes = extractCustomFields(
    message,
    customAttributes,
    ["traits", "context.traits"],
    USER_EXCLUSION_FIELDS
  );

  const userCustomFieldsMap = getHashFromArray(
    Config.userAttributeMap,
    "from",
    "to",
    false
  );
  customAttributes = renameCustomFields(customAttributes, userCustomFieldsMap);
  payload = {
    ...payload,
    propertyKeys,
    customAttributes
  };

  if (isPresent) {
    // update user
    payload = removeKeysFromPayload(payload, ["signUpDate", "createDate"]);
    response.method = defaultPutRequestConfig.requestMethod;
    response.endpoint = `${ENDPOINTS.USERS_ENDPOINT}/${userId}`;
    response.body.JSON = removeUndefinedAndNullValues(payload);
    return response;
  }

  // create new user
  payload.identifyId = userId;
  response.method = defaultPostRequestConfig.requestMethod;
  response.endpoint = ENDPOINTS.USERS_ENDPOINT;
  response.body.JSON = removeUndefinedAndNullValues(payload);
  return response;
};

/**
 * Processing Single event
 */
const process = async event => {
  const { message, destination } = event;
  if (!message.type) {
    throw new CustomError(
      "Message Type is not present. Aborting message.",
      400
    );
  }

  if (!destination.Config.apiKey) {
    throw new CustomError("Invalid API Key. Aborting message.", 400);
  }

  const propertyKeys = getProductTagKeys(destination.Config.propertyKeys);
  if (!propertyKeys || propertyKeys.length === 0) {
    throw new CustomError("atleast one property key is required", 400);
  }

  const messageType = message.type.toLowerCase();

  let response;
  switch (messageType) {
    case EventType.IDENTIFY:
      response = await identifyResponseBuilder(
        message,
        propertyKeys,
        destination
      );
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
