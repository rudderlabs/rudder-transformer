const { EventType } = require("../../../constants");
const {
  defaultRequestConfig,
  removeUndefinedAndNullValues,
  getIntegrationsObj,
  getFieldValueFromMessage,
  getDestinationExternalID,
  simpleProcessRouterDest
} = require("../../util");
const {
  getAccessToken,
  retrieveUserDetails,
  flattenProperties,
  stringifyIdentifyPayloadTimeStamps,
  stringifyTrackPayloadTimeStamps,
  createUserPayloadBuilder,
  updateUserPayloadBuilder,
  createResponsePayloadBuilder,
  createDeclinePayloadBuilder
} = require("./util");
const { PROPERTIES, END_USER_PROPERTIES } = require("./config");
const {
  TransformationError,
  InstrumentationError
} = require("../../util/errorTypes");

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
  throw new TransformationError(
    "Something went wrong while constructing the payload"
  );
};

const identifyResponseBuilder = async (message, destination) => {
  let payload;
  let endpoint;
  let method;
  let builder;

  const accessToken = await getAccessToken(destination);

  const rawEndUserId = getDestinationExternalID(message, "wootricEndUserId");
  const userId = getFieldValueFromMessage(message, "userIdOnly");
  const userDetails = await retrieveUserDetails(
    rawEndUserId,
    userId,
    accessToken
  );
  const wootricEndUserId = userDetails?.id;

  // If user already exist we will update it else creates a new user
  if (!wootricEndUserId) {
    builder = createUserPayloadBuilder(message);
    payload = builder.payload;
    endpoint = builder.endpoint;
    method = builder.method;
  } else {
    builder = updateUserPayloadBuilder(message, userDetails);
    payload = builder.payload;
    endpoint = builder.endpoint.replace("<end_user_id>", wootricEndUserId);
    method = builder.method;
  }

  payload = stringifyIdentifyPayloadTimeStamps(payload);
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

  const rawEndUserId = getDestinationExternalID(message, "wootricEndUserId");
  const userId = getFieldValueFromMessage(message, "userIdOnly");
  const userDetails = await retrieveUserDetails(
    rawEndUserId,
    userId,
    accessToken
  );
  const wootricEndUserId = userDetails?.id;

  if (!wootricEndUserId && rawEndUserId) {
    // If user not found and context.externalId.0.id is present in request
    throw new InstrumentationError(
      `No user found with wootric end user Id : ${rawEndUserId}`
    );
  }

  // If user not found and context.externalId.0.id is not present in request and userId is present in request
  if (!wootricEndUserId) {
    throw new InstrumentationError(`No user found with userId : ${userId}`);
  }

  const integrationsObj = getIntegrationsObj(message, "wootric");

  if (!integrationsObj || !integrationsObj.eventType) {
    throw new InstrumentationError(
      "Event Type is missing from Integration object"
    );
  }

  // "integrations": {
  //  "All": true,
  //  "Wootric": {
  //    "eventType": "create response"
  //  }

  const eventType = integrationsObj.eventType.toLowerCase();
  switch (eventType) {
    case "create response":
      builder = createResponsePayloadBuilder(message, userDetails);
      payload = builder.payload;
      endpoint = builder.endpoint;
      method = builder.method;
      break;
    case "create decline":
      builder = createDeclinePayloadBuilder(message, userDetails);
      payload = builder.payload;
      endpoint = builder.endpoint;
      method = builder.method;
      break;
    default:
      throw new InstrumentationError("Event Type not supported");
  }

  endpoint = endpoint.replace("<end_user_id>", wootricEndUserId);

  payload = stringifyTrackPayloadTimeStamps(payload);
  const flattenedProperties = flattenProperties(payload, END_USER_PROPERTIES);
  payload = { ...payload, ...flattenedProperties };
  delete payload.properties;
  return responseBuilder(payload, endpoint, method, accessToken);
};

const processEvent = async (message, destination) => {
  if (!message.type) {
    throw new InstrumentationError("Event type is required");
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
      throw new InstrumentationError(
        `Event type "${messageType}" is not supported`
      );
  }
  return response;
};

const process = async event => {
  return processEvent(event.message, event.destination);
};

const processRouterDest = async (inputs, reqMetadata) => {
  const respList = await simpleProcessRouterDest(inputs, process, reqMetadata);
  return respList;
};

module.exports = { process, processRouterDest };
