const set = require("set-value");
const get = require("get-value");
const {
  defaultRequestConfig,
  CustomError,
  constructPayload,
  getValueFromMessage,
  isDefinedAndNotNull
} = require("../../util");
const { EventType } = require("../../../constants");
const { CONFIG_CATEGORIES, MAPPING_CONFIG, BASE_URL } = require("./config");

// This function handles any tag add or removal requests.

const tagResponseBuilder = async (message, tags, destination) => {
  const response = defaultRequestConfig();

  const payload = {};
  const authToken = get(destination, "Config.authToken");
  set(payload, "auth_token", authToken);

  const id = getValueFromMessage(message, "userId");
  set(payload, "id", id);

  // add[] and remove[] arrays contain the tags to be added or removed.
  const addTags = getValueFromMessage(tags, "add");
  if (Array.isArray(addTags) && addTags.length > 0)
    set(payload, "add", addTags);

  const removeTags = getValueFromMessage(tags, "remove");
  if (Array.isArray(removeTags) && removeTags.length > 0)
    set(payload, "remove", removeTags);

  response.endpoint = `${BASE_URL}/users/tags/edit`;
  response.body.JSON = payload;
  response.method = "PUT";

  return response;
};

// This function handles the common response payload for the supported calls

const commonResponseBuilder = async (message, category, destination) => {
  const response = defaultRequestConfig();

  const payload = constructPayload(message, MAPPING_CONFIG[category.name]);
  const authToken = get(destination, "Config.authToken");
  set(payload, "auth_token", authToken);

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
    set(payload, "channels.type", "push");
  }

  response.endpoint = category.endpoint;
  response.body.JSON = payload;

  return response;
};

// This function handles identify and track requests as well as
// addition-removal of tags.

const identifyAndTrackResponseBuilder = async (
  message,
  category,
  destination
) => {
  const respList = [];
  const response = await commonResponseBuilder(message, category, destination);
  respList.push(response);

  // Tags are being passed around from Integrations object.
  const tags = getValueFromMessage(message, "integrations.Vero.tags");
  if (isDefinedAndNotNull(tags)) {
    const tagsResponse = await tagResponseBuilder(message, tags, destination);
    respList.push(tagsResponse);
  }

  return respList;
};
// This function handles alias calls.
const aliasResponseBuilder = async (message, category, destination) => {
  const response = await commonResponseBuilder(message, category, destination);
  response.method = "PUT";

  return response;
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
