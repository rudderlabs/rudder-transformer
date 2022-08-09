const get = require("get-value");
const { EventType } = require("../../../constants");
const {
  defaultRequestConfig,
  constructPayload,
  removeUndefinedAndNullValues,
  getIntegrationsObj,
  getErrorRespEvents,
  getSuccessRespEvents,
  formatTimeStamp,
  CustomError
} = require("../../util");
const { getAccessToken, retrieveUserId } = require("./util");
const { CONFIG_CATEGORIES, MAPPING_CONFIG } = require("./config");
const { set } = require("lodash");

const responseBuilder = async (payload, endpoint, method, destination) => {
  if (payload) {
    const response = defaultRequestConfig();
    const accessToken = await getAccessToken(destination);
    if (!accessToken) {
      throw new CustomError(`[Wootric]:: access token is not available`, 400);
    }
    response.endpoint = endpoint;
    response.headers = {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Bearer ${accessToken}`,
      Accept: "application/json"
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

  const userId =
    message.userId ||
    message.traits?.userId ||
    message.traits?.id ||
    message.context?.traits?.userId ||
    message.context?.traits?.id ||
    message.anonymousId;

  const wootricEndUserId = await retrieveUserId(userId, destination);
  if (!wootricEndUserId) {
    payload = constructPayload(
      message,
      MAPPING_CONFIG[CONFIG_CATEGORIES.CREATE_USER.name]
    );
    endpoint = CONFIG_CATEGORIES.CREATE_USER.endpoint;
    method = "POST";

    if (!payload.properties.email && !payload.properties.phone_number) {
      throw new CustomError(
        "email/phone number are missing. At least one parameter must be provided",
        400
      );
    }
  } else {
    payload = constructPayload(
      message,
      MAPPING_CONFIG[CONFIG_CATEGORIES.UPDATE_USER.name]
    );
    endpoint = CONFIG_CATEGORIES.UPDATE_USER.endpoint.replace(
      "<end_user_id>",
      wootricEndUserId
    );
    method = "PUT";
  }

  if (payload.last_surveyed) {
    set(
      payload,
      "last_surveyed",
      Math.floor(formatTimeStamp(payload.last_surveyed) / 1000)
    );
  }

  return responseBuilder(payload, endpoint, method, destination);
};

const trackResponseBuilder = async (message, destination) => {
  let payload;
  let endpoint;

  const userId =
    message.userId ||
    message.traits?.userId ||
    message.traits?.id ||
    message.context?.traits?.userId ||
    message.context?.traits?.id ||
    message.anonymousId;

  const wootricEndUserId = await retrieveUserId(userId, destination);
  if (!wootricEndUserId) {
    throw new CustomError(`No user found with end user id : ${userId}`, 400);
  }

  const integrationsObj = getIntegrationsObj(message, "wootric");
  const survey = get(integrationsObj, "survey");
  if (survey === "create response") {
    payload = constructPayload(
      message,
      MAPPING_CONFIG[CONFIG_CATEGORIES.CREATE_RESPONSE.name]
    );
    endpoint = CONFIG_CATEGORIES.CREATE_RESPONSE.endpoint;
  } else if (survey === "create decline") {
    payload = constructPayload(
      message,
      MAPPING_CONFIG[CONFIG_CATEGORIES.CREATE_DECLINE.name]
    );
    endpoint = CONFIG_CATEGORIES.CREATE_DECLINE.endpoint;
  }
  endpoint = endpoint.replace("<end_user_id>", wootricEndUserId);
  return responseBuilder(payload, endpoint, "POST", destination);
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
