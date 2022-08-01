const { logger } = require("handlebars");
const { EventType } = require("../../../constants");
const { httpPOST } = require("../../../adapters/network");
const { ConfigCategory, mappingConfig, BASE_URL } = require("./config");
const {
  defaultRequestConfig,
  constructPayload,
  defaultPostRequestConfig,
  removeUndefinedAndNullValues,
  CustomError,
  getHashFromArrayWithDuplicate
} = require("../../util");
const {retrieveUserId}=require("./util");

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
  let payload = {};
  let responseBody;
  let contentType;

  Object.keys(eventsMap).forEach(async key => {
    if (key === event) {
      eventsMap[event].forEach(async val => {
        if (val === "createVote") {
          const postID =
            message?.postID ||
            message?.properties?.postID ||
            message?.postId ||
            message?.properties?.postId ||
            message?.properties?.post?.id;

          if (!postID) {
            throw new CustomError(
              "postID is not present. Aborting message.",
              400
            );
          }

          payload.apiKey = apiKey;
          payload.postID = postID;
          payload.voterID = "voterid";
          //   payload.voterID = await retrieveUserId(apiKey, message);
          endpoint = ConfigCategory.CREATE_VOTE.endpoint;

          responseBody = "FORM";
          contentType = "application/x-www-form-urlencoded";
        } else if (val === "createPost") {
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
