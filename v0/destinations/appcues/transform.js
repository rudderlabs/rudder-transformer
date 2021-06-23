/* eslint-disable no-underscore-dangle */
const { EventType } = require("../../../constants");

const {
  constructPayload,
  defaultRequestConfig,
  removeUndefinedAndNullValues,
  removeUndefinedAndNullAndEmptyValues,
  getSuccessRespEvents,
  getErrorRespEvents,
  CustomError
} = require("../../util");

const { ConfigCategory, mappingConfig, getEndpoint } = require("./config");

function buildResponse(payload, endpoint) {
  const response = defaultRequestConfig();
  response.endpoint = endpoint;
  response.body.JSON = removeUndefinedAndNullValues(payload);
  return {
    ...response,
    headers: {
      "Content-Type": "application/json"
    }
  };
}

function processTrackEvent(message, destination, mappingJson) {
  const requestJson = constructPayload(
    message,
    mappingConfig[ConfigCategory.DEFAULT.name]
  );

  const eventJson = constructPayload(message, mappingJson);
  requestJson.events = [eventJson];

  return buildResponse(
    requestJson,
    getEndpoint(destination.Config.accountId, message.userId)
  );
}

function processPage(message, destination, pageTrackJson, pageProfileJson) {
  const requestJson = constructPayload(
    message,
    mappingConfig[ConfigCategory.DEFAULT.name]
  );

  // generating profile part of the payload
  const profileJson = constructPayload(message, pageProfileJson);
  profileJson._appcuesId = destination.Config.accountId;
  requestJson.profile_update = profileJson;

  // generating event part of the payload
  const eventJson = constructPayload(message, pageTrackJson);

  eventJson.attributes = removeUndefinedAndNullAndEmptyValues(
    eventJson.attributes
  );

  requestJson.events = [eventJson];

  return buildResponse(
    requestJson,
    getEndpoint(destination.Config.accountId, message.userId)
  );
}

function process(event) {
  const { message, destination } = event;

  if (!message.type) {
    throw new CustomError(
      "Message Type is not present. Aborting message.",
      400
    );
  }

  if (!message.userId) {
    throw new CustomError(
      "User id is absent. Aborting event as userId is mandatory for Appcues",
      400
    );
  }

  const messageType = message.type.toLowerCase();

  switch (messageType) {
    case EventType.TRACK:
      return processTrackEvent(
        message,
        destination,
        mappingConfig[ConfigCategory.TRACK.name]
      );
    case EventType.PAGE:
      message.event = "Visited a Page";
      return processPage(
        message,
        destination,
        mappingConfig[ConfigCategory.PAGETRACK.name],
        mappingConfig[ConfigCategory.PAGEPROFILE.name]
      );
    case EventType.SCREEN:
      message.event = "Viewed a Screen";
      return processTrackEvent(
        message,
        destination,
        mappingConfig[ConfigCategory.TRACK.name]
      );
    case EventType.IDENTIFY:
      return buildResponse(
        constructPayload(message, mappingConfig[ConfigCategory.IDENTIFY.name]),
        getEndpoint(destination.Config.accountId, message.userId)
      );
    default:
      throw new CustomError("Message type is not supported", 400);
  }
}

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
