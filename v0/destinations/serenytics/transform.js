const { EventType } = require("../../../constants");
const {
  CustomError,
  constructPayload,
  defaultRequestConfig,
  defaultPostRequestConfig,
  getErrorRespEvents,
  getSuccessRespEvents,
  getHashFromArrayWithDuplicate,
  ErrorMessage,
  extractCustomFields
} = require("../../util");

const {
  CONFIG_CATEGORIES,
  MAPPING_CONFIG,
  SERENYTICS_TRACK_EXCLUSION_LIST,
  SERENYTICS_IDENTIFY_EXCLUSION_LIST,
  SERENYTICS_PAGE_SCREEN_EXCLUSION_LIST
} = require("./config");

const responseBuilder = (STORAGE_URL, payload) => {
  const response = defaultRequestConfig();
  response.endpoint = STORAGE_URL;
  response.method = defaultPostRequestConfig.requestMethod;
  response.body.JSON = payload;
  return response;
};

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
    throw new CustomError(`[Serenytics]: storage url is required.`, 400);
  }
  const productList = message.properties?.products;
  if (productList && Array.isArray(productList)) {
    const responseList = [];
    const finalPayload = payload;
    productList.forEach(product => {
      const productDetails = constructPayload(
        product,
        MAPPING_CONFIG[CONFIG_CATEGORIES.PROPERTY.name]
      );
      payload = { ...payload, ...productDetails };
      const response = defaultRequestConfig();
      response.method = defaultPostRequestConfig.requestMethod;
      response.body.JSON = payload;
      const storageUrlEventList = storageUrlEventMapping[event];
      if (storageUrlEventList && Array.isArray(storageUrlEventList)) {
        storageUrlEventList.forEach(eventUrl => {
          response.endpoint = eventUrl;
          responseList.push(response);
        });
      }
      payload = finalPayload;
    });
    return responseList;
  }

  const response = defaultRequestConfig();
  response.method = defaultPostRequestConfig.requestMethod;
  response.body.JSON = payload;
  const storageUrlEventList = storageUrlEventMapping[event];
  if (storageUrlEventList && Array.isArray(storageUrlEventList)) {
    const responseList = [];
    storageUrlEventList.forEach(eventUrl => {
      response.endpoint = eventUrl;
      responseList.push(response);
    });
    return responseList;
  }
  response.endpoint = STORAGE_URL;
  return response;
};

const processEvent = async (message, destination) => {
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
      payload = constructPayload(
        message,
        MAPPING_CONFIG[CONFIG_CATEGORIES.TRACK.name]
      );
      payload = extractCustomFields(
        message,
        payload,
        ["properties"],
        SERENYTICS_TRACK_EXCLUSION_LIST
      );
      response = await trackResponseBuilder(message, destination, payload);
      return response;
    case EventType.IDENTIFY:
      if (!Config.storageUrlIdentify) {
        throw new CustomError(`[Serenytics]: storage url is required.`, 400);
      }
      STORAGE_URL = Config.storageUrlIdentify;
      payload = constructPayload(
        message,
        MAPPING_CONFIG[CONFIG_CATEGORIES.IDENTIFY.name]
      );
      payload = extractCustomFields(
        message,
        payload,
        ["traits", "context.traits"],
        SERENYTICS_IDENTIFY_EXCLUSION_LIST
      );
      break;
    case EventType.GROUP:
      if (!Config.storageUrlGroup) {
        throw new CustomError(`[Serenytics]: storage url is required.`, 400);
      }
      STORAGE_URL = Config.storageUrlGroup;
      payload = constructPayload(
        message,
        MAPPING_CONFIG[CONFIG_CATEGORIES.GROUP.name]
      );
      break;
    case EventType.PAGE:
      if (!Config.storageUrlPage) {
        throw new CustomError(`[Serenytics]: storage url is required.`, 400);
      }
      STORAGE_URL = Config.storageUrlPage;
      payload = constructPayload(
        message,
        MAPPING_CONFIG[CONFIG_CATEGORIES.PAGE.name]
      );
      payload = extractCustomFields(
        message,
        payload,
        ["properties"],
        SERENYTICS_PAGE_SCREEN_EXCLUSION_LIST
      );
      break;
    case EventType.SCREEN:
      if (!Config.storageUrlScreen) {
        throw new CustomError(`[Serenytics]: storage url is required.`, 400);
      }
      STORAGE_URL = Config.storageUrlScreen;
      payload = constructPayload(
        message,
        MAPPING_CONFIG[CONFIG_CATEGORIES.SCREEN.name]
      );
      payload = extractCustomFields(
        message,
        payload,
        ["properties"],
        SERENYTICS_PAGE_SCREEN_EXCLUSION_LIST
      );
      break;
    case EventType.ALIAS:
      if (!Config.storageUrlAlias) {
        throw new CustomError(`[Serenytics]: storage url is required.`, 400);
      }
      STORAGE_URL = Config.storageUrlAlias;
      payload = constructPayload(
        message,
        MAPPING_CONFIG[CONFIG_CATEGORIES.ALIAS.name]
      );
      break;
    default:
      throw new CustomError(`message type ${messageType} not supported`, 400);
  }
  if (!payload) {
    // fail-safety for developer error
    throw new CustomError(ErrorMessage.FailedToConstructPayload, 400);
  }
  response = await responseBuilder(STORAGE_URL, payload);
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
