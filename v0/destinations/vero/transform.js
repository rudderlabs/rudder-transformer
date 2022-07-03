const set = require("set-value");
const get = require("get-value");
const {
  defaultRequestConfig,
  CustomError,
  constructPayload,
  getValueFromMessage,
  isDefinedAndNotNull,
  removeUndefinedAndNullAndEmptyValues
} = require("../../util");
const { EventType } = require("../../../constants");
const { CONFIG_CATEGORIES, MAPPING_CONFIG } = require("./config");

// This function handles the common response payload for the supported calls
const commonResponseBuilder = (message, category, destination) => {
  const payload = constructPayload(message, MAPPING_CONFIG[category.name]);
  const authToken = get(destination, "Config.authToken");
  set(payload, "auth_token", authToken);

  // channels is defined only for Identify call
  if (category.type === EventType.IDENTIFY) {
    const channels = get(payload, "channels");
    const address = get(channels, "address");
    const platform = get(channels, "platform");

    // Vero only accepts a valid channels object - address, platform and type should be defined and not null
    if (isDefinedAndNotNull(address) && isDefinedAndNotNull(platform)) {
      set(payload, "channels.type", category.channelType);
    }
    // Added this block because channels & channels.device can be defined and not null, which should be removed
    else if (isDefinedAndNotNull(channels)) {
      delete payload.channels;
    }
  }

  const response = defaultRequestConfig();
  response.endpoint = category.endpoint;
  response.body.JSON = removeUndefinedAndNullAndEmptyValues(payload);
  response.method = category.method;

  return response;
};

// This function handles identify and track requests as well as addition-removal of tags.
const identifyAndTrackResponseBuilder = (message, category, destination) => {
  const respList = [];
  const response = commonResponseBuilder(message, category, destination);
  respList.push(response);

  // This block handles any tag addition or removal requests.
  // Ref - https://developers.getvero.com/?bash#tags
  const tags = getValueFromMessage(message, "integrations.Vero.tags");
  const addTags = get(tags, "add");
  const removeTags = get(tags, "remove");
  // Both add and remove should be an array and at least one should have a length > 0
  if (
    (Array.isArray(removeTags) && removeTags.length > 0) ||
    (Array.isArray(addTags) && addTags.length > 0)
  ) {
    const tagCategory = CONFIG_CATEGORIES.TAGS;
    const tagsResponse = commonResponseBuilder(
      message,
      tagCategory,
      destination
    );
    respList.push(tagsResponse);
  }

  return respList;
};

const process = async event => {
  const { message, destination } = event;
  if (!message.type) {
    throw new CustomError(
      "Message Type is not present. Aborting message.",
      400
    );
  }

  const authToken = get(destination, "Config.authToken");
  if (!authToken) {
    throw new CustomError("Auth Token required for Authentication.", 400);
  }

  let response;
  const messageType = message.type.toLowerCase();
  const category = CONFIG_CATEGORIES[message.type.toUpperCase()];
  switch (messageType) {
    case EventType.TRACK:
    case EventType.IDENTIFY:
      // Identify Ref - https://developers.getvero.com/?bash#users-identify
      // Track Ref - https://developers.getvero.com/?bash#events-track
      response = identifyAndTrackResponseBuilder(
        message,
        category,
        destination
      );
      break;
    case EventType.ALIAS:
      // Alias Ref - https://developers.getvero.com/?bash#users-alias
      response = commonResponseBuilder(message, category, destination);
      break;
    case EventType.PAGE:
    case EventType.SCREEN: {
      const eventCategory = get(message, "properties.category");
      const name = get(message, "name");
      message.event = `Viewed ${eventCategory ? `${eventCategory} ` : ""}${
        name ? `${name} ` : ""
      }Page`;
      response = commonResponseBuilder(
        message,
        CONFIG_CATEGORIES.TRACK,
        destination
      );
      break;
    }
    default:
      throw new CustomError(`Message type ${messageType} not supported`, 400);
  }
  return response;
};

module.exports = { process };
