const { CONFIG_CATEGORIES, MAPPING_CONFIG } = require("./config");
const { EventType } = require("../../../constants");
const {
  constructPayload,
  defaultPostRequestConfig,
  removeUndefinedAndNullValues,
  defaultRequestConfig,
  flattenJson
} = require("../../util");

function responseBuilderSimple(message, category, destination) {
  const { Config } = destination;
  const {
    pixelId,
    accessToken,
    blacklistPiiProperties,
    categoryToContent,
    eventsToEvents,
    eventCustomProperties,
    valueFieldIdentifier,
    advancedMapping,
    legacyConversionPixelId,
    whitelistPiiProperties,
    limitedDataUSage
  } = Config;

  const endpoint = `https://graph.facebook.com/v9.0/${pixelId}/events?access_token=${accessToken}`;

  const payload = constructPayload(message, MAPPING_CONFIG[category.name]);
  
}

const processEvent = (message, destination) => {
  if (!message.type) {
    throw Error("Message Type is not present. Aborting message.");
  }

  const messageType = message.type.toLowerCase();
  let category;
  switch (messageType) {
    case EventType.IDENTIFY:
      category = CONFIG_CATEGORIES.IDENTIFY;
      break;
    case EventType.PAGE:
      category = CONFIG_CATEGORIES.PAGE;
      break;
    case EventType.SCREEN:
      category = CONFIG_CATEGORIES.SCREEN;
      break;
    case EventType.TRACK:
      category = CONFIG_CATEGORIES.TRACK;
      break;
    default:
      throw new Error("Message type not supported");
  }

  // build the response
  return responseBuilderSimple(message, category, destination);
};

const process = event => {
  return processEvent(event.message, event.destination);
};

exports.process = process;
