const { EventType } = require("../../../constants");
const { ConfigCategory, mappingConfig, BASE_URL } = require("./config");
const {
  defaultRequestConfig,
  constructPayload,
  defaultPostRequestConfig,
  removeUndefinedAndNullValues,
  CustomError,
  getHashFromArrayWithDuplicate,
  getErrorRespEvents,
  getSuccessRespEvents
} = require("../../util");
const {
  retrieveUserId,
  validateIdentifyFields,
  validateCreatePostFields,
  validateEventMapping
} = require("./util");

const responseBuilder = responseConfgs => {
  const {
    payload,
    apiKey,
    endpoint,
    contentType,
    responseBody
  } = responseConfgs;

  const response = defaultRequestConfig();
  if (payload) {
    response.endpoint = `${BASE_URL}${endpoint}`;
    response.headers = {
      Authorization: `Basic ${apiKey}`,
      "Content-Type": contentType
    };
    response.method = defaultPostRequestConfig.requestMethod;
    response.body[`${responseBody}`] = removeUndefinedAndNullValues(payload);
  }
  return response;
};

const identifyResponseBuilder = (message, { Config }) => {
  const { apiKey } = Config;
  const contentType = "application/json";
  const responseBody = "JSON";

  const payload = constructPayload(
    message,
    mappingConfig[ConfigCategory.IDENTIFY.name]
  );
  payload.apiKey = apiKey;

  validateIdentifyFields(payload);

  const { endpoint } = ConfigCategory.IDENTIFY;

  const responseConfgs = {
    payload,
    apiKey,
    endpoint,
    contentType,
    responseBody
  };
  return responseBuilder(responseConfgs);
};

const getTrackResponse = async (apiKey, message, operationType) => {
  let endpoint;
  let responseBody;
  let contentType;
  let payload;
  if (operationType === "createVote") {
    responseBody = "FORM";
    contentType = "application/x-www-form-urlencoded";

    payload = constructPayload(
      message,
      mappingConfig[ConfigCategory.CREATE_VOTE.name]
    );
    if (!payload.postID) {
      throw new CustomError("PostID is not present. Aborting message.", 400);
    }

    payload.apiKey = apiKey;
    const voterID = await retrieveUserId(apiKey, message);
    payload.voterID = voterID;
    endpoint = ConfigCategory.CREATE_VOTE.endpoint;
  } else if (operationType === "createPost") {
    contentType = "application/json";
    responseBody = "JSON";

    payload = constructPayload(
      message,
      mappingConfig[ConfigCategory.CREATE_POST.name]
    );

    validateCreatePostFields(payload);

    payload.apiKey = apiKey;
    payload.authorID = await retrieveUserId(apiKey, message);

    endpoint = ConfigCategory.CREATE_POST.endpoint;
  }

  const responseConfgs = {
    payload,
    apiKey,
    endpoint,
    contentType,
    responseBody
  };
  return responseBuilder(responseConfgs);
};

const trackResponseBuilder = async (message, { Config }) => {
  const { apiKey, eventsToEvents } = Config;
  const configuredEventsMap = getHashFromArrayWithDuplicate(eventsToEvents);

  const event = message.event?.toLowerCase().trim();
  validateEventMapping(configuredEventsMap, event);

  const responseArray = [];
  const configuredSourceEvents = Object.keys(configuredEventsMap);
  for (const configuredSourceEvent of configuredSourceEvents) {
    if (configuredSourceEvent === event) {
      const destinationEvents = configuredEventsMap[event];
      for (const destinationEvent of destinationEvents) {
        const response = await getTrackResponse(
          apiKey,
          message,
          destinationEvent
        );
        responseArray.push(response);
      }
    }
  }

  return responseArray;
};

const processEvent = (message, destination) => {
  if (!destination.Config.apiKey) {
    throw new CustomError("API Key is not present. Aborting message.", 400);
  }
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
        const message = input.message.statusCode
          ? input.message
          : process(input);
        return getSuccessRespEvents(
          message,
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
