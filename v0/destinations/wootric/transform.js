const { EventType } = require("../../../constants");
const {
  defaultRequestConfig,
  removeUndefinedAndNullValues,
  getIntegrationsObj,
  getErrorRespEvents,
  getSuccessRespEvents,
  getFieldValueFromMessage,
  getDestinationExternalID,
  CustomError
} = require("../../util");
const {
  getAccessToken,
  retrieveUserId,
  flattenProperties,
  formatIdentifyPayload,
  formatTrackPayload,
  createUserPayloadBuilder,
  updateUserPayloadBuilder,
  createResponsePayloadBuilder,
  createDeclinePayloadBuilder,
  checkExistingEmailAndPhone
} = require("./util");
const { PROPERTIES, END_USER_PROPERTIES } = require("./config");

const responseBuilder = async (payload, endpoint, method, accessToken) => {
  if (payload) {
    const response = defaultRequestConfig();
    response.endpoint = endpoint;
    response.headers = {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Bearer ${accessToken}`
    };
    response.method = method;
    response.body.FORM = removeUndefinedAndNullValues(payload);
    return response;
  }
  // fail-safety for developer error
  throw new CustomError("Payload could not be constructed", 400);
};

const identifyResponseBuilder = async (message, destination) => {
  let payload;
  let endpoint;
  let method;
  let builder;

  const accessToken = await getAccessToken(destination);
  if (!accessToken) {
    throw new CustomError("Access token is missing", 400);
  }

  let wootricEndUserId = getDestinationExternalID(message, "wootricEndUserId");
  const userId = getFieldValueFromMessage(message, "userId");
  if (!wootricEndUserId) {
    wootricEndUserId = await retrieveUserId(userId, accessToken);
  }

  // If user already exist we will update it else creates a new user
  if (!wootricEndUserId) {
    builder = createUserPayloadBuilder(message);
    payload = builder.payload;
    endpoint = builder.endpoint;
    method = builder.method;
  } else {
    builder = updateUserPayloadBuilder(message);
    payload = builder.payload;
    endpoint = builder.endpoint.replace("<end_user_id>", wootricEndUserId);
    method = builder.method;
  }

  // Throw error if user already exist with given email/phone
  await checkExistingEmailAndPhone(
    payload.email,
    payload.phone_number,
    userId,
    accessToken
  );

  formatIdentifyPayload(payload);
  const flattenedProperties = flattenProperties(payload, PROPERTIES);
  payload = { ...payload, ...flattenedProperties };
  delete payload.properties;
  return responseBuilder(payload, endpoint, method, accessToken);
};

const trackResponseBuilder = async (message, destination) => {
  let payload;
  let endpoint;
  let method;
  let builder;

  const accessToken = await getAccessToken(destination);
  if (!accessToken) {
    throw new CustomError("Access token is missing", 400);
  }

  let wootricEndUserId = getDestinationExternalID(message, "wootricEndUserId");
  const userId = getFieldValueFromMessage(message, "userId");
  if (!wootricEndUserId) {
    wootricEndUserId = await retrieveUserId(userId, accessToken);
  }

  if (!wootricEndUserId) {
    throw new CustomError(
      `No user found with wootric external_id : ${userId}`,
      400
    );
  }

  const integrationsObj = getIntegrationsObj(message, "wootric");

  if (!integrationsObj || !integrationsObj.eventType) {
    throw new CustomError("Event Type is missing from Integration object", 400);
  }

  // "integrations": {
  //  "All": true,
  //  "Wootric": {
  //    "eventType": "create response"
  //  }

  const eventType = integrationsObj.eventType.toLowerCase();
  switch (eventType) {
    case "create response":
      builder = createResponsePayloadBuilder(message);
      payload = builder.payload;
      endpoint = builder.endpoint;
      method = builder.method;
      break;
    case "create decline":
      builder = createDeclinePayloadBuilder(message);
      payload = builder.payload;
      endpoint = builder.endpoint;
      method = builder.method;
      break;
    default:
      throw new CustomError("Event Type not supported", 400);
  }

  endpoint = endpoint.replace("<end_user_id>", wootricEndUserId);

  formatTrackPayload(payload);
  const flattenedProperties = flattenProperties(payload, END_USER_PROPERTIES);
  payload = { ...payload, ...flattenedProperties };
  delete payload.properties;
  return responseBuilder(payload, endpoint, method, accessToken);
};

const processEvent = async (message, destination) => {
  if (!message.type) {
    throw new CustomError(
      "Message Type is not present. Aborting message.",
      400
    );
  }
  const messageType = message.type.toLowerCase();
  let response;
  switch (messageType) {
    case EventType.IDENTIFY:
      response = await identifyResponseBuilder(message, destination);
      break;
    case EventType.TRACK:
      response = await trackResponseBuilder(message, destination);
      break;
    default:
      throw new CustomError("Message type not supported", 400);
  }
  return response;
};

const process = async event => {
  return processEvent(event.message, event.destination);
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
