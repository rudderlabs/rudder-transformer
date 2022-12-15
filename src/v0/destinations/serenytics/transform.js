const { EventType } = require("../../../constants");
const {
  CustomError,
  getErrorRespEvents,
  getSuccessRespEvents,
  getHashFromArrayWithDuplicate,
  ErrorMessage
} = require("../../util");

const {
  CONFIG_CATEGORIES,
  SERENYTICS_TRACK_EXCLUSION_LIST,
  SERENYTICS_IDENTIFY_EXCLUSION_LIST,
  SERENYTICS_PAGE_SCREEN_EXCLUSION_LIST
} = require("./config");
const {
  payloadBuilder,
  storageUrlResponseBuilder,
  responseBuilder,
  checkStorageUrl
} = require("./utils");

const trackResponseBuilder = (message, { Config }, payload) => {
  const STORAGE_URL = Config.storageUrlTrack;
  const storageUrlEventMapping = getHashFromArrayWithDuplicate(
    Config.eventToStorageUrlMap,
    "from",
    "to",
    false
  );
  const { event } = message;
  if (!event) {
    throw new CustomError(
      `[Serenytics]: event name is required in track call.`,
      400
    );
  }
  if (!storageUrlEventMapping[event] && !STORAGE_URL) {
    throw new CustomError(`Storage url for "TRACK" is missing. Aborting!`, 400);
  }

  const storageUrlEventList = storageUrlEventMapping[event];
  const responseList =
    storageUrlResponseBuilder(storageUrlEventList, payload) || [];

  if (STORAGE_URL) {
    const response = responseBuilder(STORAGE_URL, payload);
    responseList.push(response);
  }
  return responseList;
};

const processEvent = (message, destination) => {
  if (!message.type) {
    throw new CustomError(
      "Message Type is not present. Aborting message.",
      400
    );
  }
  const messageType = message.type.toLowerCase();
  const { Config } = destination;
  let STORAGE_URL;
  let response;
  let payload;
  switch (messageType) {
    case EventType.TRACK:
      payload = payloadBuilder(
        message,
        CONFIG_CATEGORIES.TRACK.name,
        ["properties"],
        SERENYTICS_TRACK_EXCLUSION_LIST
      );
      break;
    case EventType.IDENTIFY:
      STORAGE_URL = Config.storageUrlIdentify;
      payload = payloadBuilder(
        message,
        CONFIG_CATEGORIES.IDENTIFY.name,
        ["traits", "context.traits"],
        SERENYTICS_IDENTIFY_EXCLUSION_LIST
      );
      break;
    case EventType.GROUP:
      STORAGE_URL = Config.storageUrlGroup;
      payload = payloadBuilder(
        message,
        CONFIG_CATEGORIES.GROUP.name,
        ["traits", "context.traits"],
        []
      );
      break;
    case EventType.PAGE:
      STORAGE_URL = Config.storageUrlPage;
      payload = payloadBuilder(
        message,
        CONFIG_CATEGORIES.PAGE.name,
        ["properties"],
        SERENYTICS_PAGE_SCREEN_EXCLUSION_LIST
      );
      break;
    case EventType.SCREEN:
      STORAGE_URL = Config.storageUrlScreen;
      payload = payloadBuilder(
        message,
        CONFIG_CATEGORIES.SCREEN.name,
        ["properties"],
        SERENYTICS_PAGE_SCREEN_EXCLUSION_LIST
      );
      break;
    case EventType.ALIAS:
      STORAGE_URL = Config.storageUrlAlias;
      payload = payloadBuilder(
        message,
        CONFIG_CATEGORIES.ALIAS.name,
        ["traits", "context.traits"],
        []
      );
      break;
    default:
      throw new CustomError(`message type ${messageType} not supported`, 400);
  }
  if (!payload) {
    // fail-safety for developer error
    throw new CustomError(ErrorMessage.FailedToConstructPayload, 400);
  }
  if (messageType === EventType.TRACK) {
    response = trackResponseBuilder(message, destination, payload);
  } else {
    checkStorageUrl(STORAGE_URL, messageType);
    response = responseBuilder(STORAGE_URL, payload);
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
