const btoa = require("btoa");
const { EventType } = require("../../../constants");

const {
  CONFIG_CATEGORIES,
  MAPPING_CONFIG,
  BASE_URL_EU,
  BASE_URL_US
} = require("./config");

const {
  constructPayload,
  defaultPostRequestConfig,
  removeUndefinedAndNullValues,
  defaultRequestConfig,
  CustomError
} = require("../../util");

function responseBuilderSimple(message, category, destination) {
  const payload = constructPayload(message, MAPPING_CONFIG[category.name]);
  const { appKey, dataCenter, appSecret } = destination.Config;
  const response = defaultRequestConfig();
  let BASE_URL = BASE_URL_US;
  // check the region and which api end point should be used
  if (dataCenter) {
    BASE_URL = BASE_URL_EU;
  }

  if (
    message.type === "identify" &&
    message.context.traits.email &&
    message.traits.channelId
  ) {
    response.endpoint = `${BASE_URL} /api/named_users/associate`;
  }
  if (message.context.traits.remove || message.context.traits.add) {
    response.endpoint = `${BASE_URL} /api/named_users/tags`;
  }
  if (payload.attributes) {
    response.endpoint = `${BASE_URL} /api/named_users/${message.traits.user_id}/attributes`;
  }
  if (message.type === "track") {
    response.endpoint = `${BASE_URL} /api/custom-events`;
  }
  response.method = defaultPostRequestConfig.requestMethod;
  response.headers = {
    "Content-Type": "application/json",
    Accept: "application/vnd.urbanairship+json; version=3",
    Authorization: `Basic ${btoa(`${appKey}:${appSecret}`)}`
  };
  const lowerCaseName = message.context.traits.toLowerCase();
  if (message.traits.name !== lowerCaseName) {
    throw new CustomError("Name can't contain uppercase letters", 400);
  }
  if (payload) {
    switch (category.type) {
      case "identify":
        payload.attributes = constructPayload(
          message,
          MAPPING_CONFIG[CONFIG_CATEGORIES.IDENTIFY.name]
        );
        break;
      case "track":
        payload.actions = [
          constructPayload(
            message,
            MAPPING_CONFIG[CONFIG_CATEGORIES.TRACK.name]
          )
        ];
        break;
      default:
        throw new CustomError("Call type is not valid", 400);
    }

    response.body.JSON = removeUndefinedAndNullValues(payload);
  } else {
    // fail-safety for developer error
    throw new CustomError("Payload could not be constructed", 400);
  }
  return response;
}

const processEvent = (message, destination) => {
  if (!message.type) {
    throw new CustomError(
      "Message Type is not present. Aborting message.",
      400
    );
  }

  const messageType = message.type.toLowerCase();
  let category;
  let response;
  switch (messageType) {
    case EventType.IDENTIFY:
      category = CONFIG_CATEGORIES.IDENTIFY;
      response = responseBuilderSimple(message, category, destination);
      break;
    case EventType.TRACK:
      category = CONFIG_CATEGORIES.TRACK;
      response = responseBuilderSimple(message, category, destination);
      break;
    // case EventType.GROUP:
    //   category = CONFIG_CATEGORIES.GROUP;
    //   // build the response
    //   response = responseBuilderSimple(message, category, destination);
    //   break;
    default:
      throw new CustomError("Message type not supported", 400);
  }

  return response;
};

const process = event => {
  return processEvent(event.message, event.destination);
};

module.exports = { process };
