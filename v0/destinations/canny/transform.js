const { logger } = require("handlebars");
const { EventType } = require("../../../constants");
const { ConfigCategory, mappingConfig, BASE_URL } = require("./config");
const {
  defaultRequestConfig,
  constructPayload,
  defaultPostRequestConfig,
  removeUndefinedAndNullValues,
  CustomError,
  getHashFromArrayWithDuplicate
} = require("../../util");
const { retrieveUserId } = require("./util");

const responseBuilder = (
  payload,
  apiKey,
  endpoint,
  contentType,
  responseBody
) => {
  if (payload) {
    const response = defaultRequestConfig();
    response.endpoint = `${BASE_URL}${endpoint}`;
    response.headers = {
      Authorization: `Basic ${apiKey}`,
      "Content-Type": contentType
    };
    response.method = defaultPostRequestConfig.requestMethod;
    response.body[`${responseBody}`] = removeUndefinedAndNullValues(payload);
    return response;
  }
};

const identifyResponseBuilder = (message, { Config }) => {
  const { apiKey } = Config;
  const contentType = "application/json";
  const responseBody = "JSON";

  if (!apiKey) {
    throw new CustomError("API Key is not present. Aborting message.", 400);
  }

  const payload = constructPayload(
    message,
    mappingConfig[ConfigCategory.IDENTIFY.name]
  );

  if (!payload.userID) {
    throw new CustomError("UserId is not present. Aborting message.", 400);
  }
  if (!payload.name) {
    throw new CustomError("Name is not present. Aborting message.", 400);
  }

  const { endpoint } = ConfigCategory.IDENTIFY;

  return responseBuilder(payload, apiKey, endpoint, contentType, responseBody);
};

const trackResponseBuilder = async (message, { Config }) => {
  const { apiKey } = Config;
  const eventsToEvents = Config.eventsToEvents;
  const eventsMap = getHashFromArrayWithDuplicate(eventsToEvents);

  if (!apiKey) {
    throw new CustomError("API Key is not present. Aborting message.", 400);
  }

  let event = message.event?.toLowerCase().trim();
  if (!event) {
    throw new CustomError("Event name is required", 400);
  }

  if (!eventsMap[event]) {
    throw new CustomError(
      `Event name (${event}) is not present in the mapping`,
      400
    );
  }

  let endpoint;
  let responseBody;
  let contentType;
  let payload;

  Object.keys(eventsMap).forEach(async key => {
    if (key === event) {
      eventsMap[event].forEach(async val => {
        if (val === "createVote") {
          responseBody = "FORM";
          contentType = "application/x-www-form-urlencoded";

          payload = constructPayload(
            message,
            mappingConfig[ConfigCategory.CREATE_VOTE.name]
          );
          if (!payload.postID) {
            throw new CustomError(
              "PostID is not present. Aborting message.",
              400
            );
          }

          payload.apiKey = apiKey;
          // payload.voterID = "voterid";
          payload.voterID = await retrieveUserId(apiKey, message);
          endpoint = ConfigCategory.CREATE_VOTE.endpoint;
        } else if (val === "createPost") {
          contentType = "application/json";
          responseBody = "JSON";

          payload = constructPayload(
            message,
            mappingConfig[ConfigCategory.CREATE_POST.name]
          );

          if (!payload.boardID) {
            throw new CustomError(
              "BoardID is not present. Aborting message.",
              400
            );
          }
          if (!payload.title) {
            throw new CustomError(
              "Title is not present. Aborting message.",
              400
            );
          }
          if (!payload.details) {
            throw new CustomError(
              "Details is not present. Aborting message.",
              400
            );
          }

          payload.authorID = "authorid";
          //   payload.authorID = await retrieveUserId(apiKey, message);

          endpoint = ConfigCategory.CREATE_POST.endpoint;
        }
      });
    }
  });

  return responseBuilder(payload, apiKey, endpoint, contentType, responseBody);
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
      response = identifyResponseBuilder(message, destination);
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
  return await processEvent(event.message, event.destination);
};

module.exports = { process };
