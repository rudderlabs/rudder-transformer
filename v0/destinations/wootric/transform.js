const { EventType } = require("../../../constants");
const {
  defaultRequestConfig,
  removeUndefinedAndNullValues,
  getIntegrationsObj,
  getErrorRespEvents,
  getSuccessRespEvents,
  getFieldValueFromMessage,
  CustomError
} = require("../../util");
const {
  getAccessToken,
  retrieveUserId,
  flattenedPayload,
  validateIdentifyPayload,
  formatIdentifyPayload,
  formatTrackPayload,
  createUserPayloadBuilder,
  updateUserPayloadBuilder,
  createResponsePayloadBuilder,
  createDeclinePayloadBuilder
} = require("./util");

const responseBuilder = async (payload, endpoint, method, destination) => {
  if (payload) {
    const response = defaultRequestConfig();
    const accessToken = await getAccessToken(destination);
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

  const userId = getFieldValueFromMessage(message, "userId");
  const wootricEndUserId = await retrieveUserId(userId, destination);
  if (!wootricEndUserId) {
    builder = createUserPayloadBuilder(message);
    payload = builder.payload;
    endpoint = builder.endpoint;
    method = builder.method;
    validateIdentifyPayload(payload);
  } else {
    builder = updateUserPayloadBuilder(message);
    payload = builder.payload;
    endpoint = builder.endpoint.replace("<end_user_id>", wootricEndUserId);
    method = builder.method;
  }

  formatIdentifyPayload(payload);
  flattenedPayload(payload, "properties");
  return responseBuilder(payload, endpoint, method, destination);
};

const trackResponseBuilder = async (message, destination) => {
  let payload;
  let endpoint;
  let method;
  let builder;

  const userId = getFieldValueFromMessage(message, "userId");
  const wootricEndUserId = await retrieveUserId(userId, destination);
  if (!wootricEndUserId) {
    throw new CustomError(`No user found with end user id : ${userId}`, 400);
  }

  const integrationsObj = getIntegrationsObj(message, "wootric");

  if (!integrationsObj || !integrationsObj.eventType) {
    throw new CustomError("Event Type is missing", 400);
  }

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
  flattenedPayload(payload, "end_user[properties]");
  return responseBuilder(payload, endpoint, method, destination);
};

const processEvent = (message, destination) => {
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
      response = identifyResponseBuilder(message, destination);
      break;
    case EventType.TRACK:
      response = trackResponseBuilder(message, destination);
      break;
    default:
      throw new CustomError("Message type not supported", 400);
  }
  return response;
};

const process = event => {
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
