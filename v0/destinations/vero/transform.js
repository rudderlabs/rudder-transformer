const set = require("set-value");
const get = require("get-value");
const {
  defaultRequestConfig,
  CustomError,
  constructPayload,
  getValueFromMessage,
  isDefinedAndNotNull,
  isDefinedAndNotNullAndNotEmpty
} = require("../../util");
const { EventType } = require("../../../constants");
const { CONFIG_CATEGORIES, MAPPING_CONFIG } = require("./config");

// This function handles the common response payload for the supported calls
const commonResponseBuilder = async (message, category, destination) => {
  const response = defaultRequestConfig();

  const payload = constructPayload(message, MAPPING_CONFIG[category.name]);
  const authToken = get(destination, "Config.authToken");
  set(payload, "auth_token", authToken);

  // channels is defined only for Identify call. For other calls both address and platform are undefined
  const address = get(payload, "channels.address");
  const platform = get(payload, "channels.platform");
  /*
    here we are adding a K-V pair in the channels object, i.e
    channels : {
      "type" : "push"
    }
    This is a mandatory but also unchanging field for channels object.
  */
  if (isDefinedAndNotNull(address) && isDefinedAndNotNull(platform)) {
    set(payload, "channels.type", category.channelType);
  }

  response.endpoint = category.endpoint;
  response.body.JSON = payload;
  response.method = category.method;

  return response;
};

// This function handles identify and track requests as well as
// addition-removal of tags.
// Identify Ref - https://developers.getvero.com/?bash#users-identify
// Track Ref - https://developers.getvero.com/?bash#events-track
const identifyAndTrackResponseBuilder = async (
  message,
  category,
  destination
) => {
  const respList = [];
  const response = await commonResponseBuilder(message, category, destination);
  respList.push(response);

  // Tags are being passed around from Integrations object.
  // This block handles any tag add or removal requests.
  // Ref - https://developers.getvero.com/?bash#tags
  const tags = getValueFromMessage(message, "integrations.Vero.tags");
  const addTags = get(tags, "add");
  const removeTags = get(tags, "remove");
  // Both add and remove should be an array and at least one should have a length > 0
  if (
    isDefinedAndNotNullAndNotEmpty(tags) &&
    ((Array.isArray(removeTags) && removeTags.length > 0) ||
      (Array.isArray(addTags) && addTags.length > 0))
  ) {
    const tagCategory = CONFIG_CATEGORIES.TAGS;
    const tagsResponse = await commonResponseBuilder(
      message,
      tagCategory,
      destination
    );
    respList.push(tagsResponse);
  }

  return respList;
};

// This function handles alias calls.
// Ref - https://developers.getvero.com/?bash#users-alias
const aliasResponseBuilder = async (message, category, destination) => {
  return commonResponseBuilder(message, category, destination);
};

const process = async event => {
  const { message, destination } = event;
  const authToken = get(destination, "Config.authToken");

  if (!message.type) {
    throw new CustomError(
      "Message Type is not present. Aborting message.",
      400
    );
  }
  if (!authToken) {
    throw new CustomError(
      "[VERO] Auth Token required for Authentication.",
      400
    );
  }

  let response;
  const messageType = message.type.toLowerCase();
  const category = CONFIG_CATEGORIES[message.type.toUpperCase()];
  switch (messageType) {
    case EventType.TRACK:
      response = await identifyAndTrackResponseBuilder(
        message,
        category,
        destination
      );
      break;
    case EventType.IDENTIFY:
      response = await identifyAndTrackResponseBuilder(
        message,
        category,
        destination
      );
      break;
    case EventType.ALIAS:
      response = await aliasResponseBuilder(message, category, destination);
      break;
    default:
      throw new CustomError(`Message type ${messageType} not supported`, 400);
  }
  return response;
};

module.exports = { process };
