/* eslint-disable no-param-reassign */
/* eslint-disable camelcase */
const sha256 = require("sha256");
const { CONFIG_CATEGORIES, MAPPING_CONFIG } = require("./config");
const { EventType } = require("../../../constants");

const {
  constructPayload,
  defaultPostRequestConfig,
  defaultRequestConfig,
  flattenJson
} = require("../../util");

function checkPiiProperties(
  custom_data,
  blacklistPiiProperties,
  whitelistPiiProperties
) {
  const defaultPiiProperties = [
    "email",
    "firstName",
    "lastName",
    "gender",
    "city",
    "country",
    "phone",
    "state",
    "zip",
    "birthday"
  ];
  blacklistPiiProperties = blacklistPiiProperties || [];
  whitelistPiiProperties = whitelistPiiProperties || [];
  const customPiiProperties = {};
  for (let i = 0; i < blacklistPiiProperties.length; i += 1) {
    const configuration = blacklistPiiProperties[i];
    customPiiProperties[configuration.blacklistPiiProperties] =
      configuration.blacklistPiiHash;
  }
  Object.keys(custom_data).forEach(function(property) {
    const isPropertyPii = defaultPiiProperties.indexOf(property) >= 0;
    let isProperyWhiteListed = false;
    for (let i = 0; i < whitelistPiiProperties.length; i += 1) {
      const configuration = whitelistPiiProperties[i];
      const properties = configuration.whitelistPiiProperties;
      if (properties === property) {
        isProperyWhiteListed = true;
      }
    }
    if (isPropertyPii) {
      if (!isProperyWhiteListed) {
        delete custom_data[property];
      }
    }

    if (Object.prototype.hasOwnProperty.call(customPiiProperties, property)) {
      if (customPiiProperties[property]) {
        custom_data[property] = sha256(String(custom_data[property]));
      } else {
        delete custom_data[property];
      }
    }
  });
  return custom_data;
}

function responseBuilderSimple(message, category, destination) {
  const { Config } = destination;
  const { pixelId, accessToken } = Config;
  let {
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

  const user_data = constructPayload(
    message,
    MAPPING_CONFIG[CONFIG_CATEGORIES.USERDATA.name]
  );
  const commonData = constructPayload(
    message,
    MAPPING_CONFIG[CONFIG_CATEGORIES.COMMON.name]
  );
  let custom_data;
  if (category.type !== "identify") {
    custom_data = flattenJson(
      constructPayload(message, MAPPING_CONFIG[category.name])
    );
    custom_data = checkPiiProperties(
      custom_data,
      blacklistPiiProperties,
      whitelistPiiProperties
    );
  }

  if (category.type === "page") {
    commonData.event_name = message.name
      ? `Viewed Page ${message.name}`
      : "Viewed a Page";
  }
  if (user_data && commonData) {
    const split = user_data.name ? user_data.name.split(" ") : null;
    if (split !== null) {
      user_data.fn = sha256(split[0]);
      user_data.ln = sha256(split[1]);
    }
    delete user_data.name;
    const response = defaultRequestConfig();
    response.endpoint = endpoint;
    response.method = defaultPostRequestConfig.requestMethod;
    const payload = {
      data: [{ user_data, ...commonData, custom_data }]
    };
    response.body.FORM = payload;
    return response;
  }
  // fail-safety for developer error
  throw new Error("Payload could not be constructed");
}

const processEvent = (message, destination) => {
  if (!message.type) {
    throw Error("Message Type is not present. Aborting message.");
  }
  const { advancedMapping } = destination.Config;
  const messageType = message.type.toLowerCase();
  let category;
  switch (messageType) {
    case EventType.IDENTIFY:
      if (advancedMapping) {
        category = CONFIG_CATEGORIES.USERDATA;
        break;
      } else {
        throw Error(
          "Advanced Mapping is not on Rudder Dashboard. Identify events will not be sent."
        );
      }
    case EventType.PAGE:
    case EventType.SCREEN:
      category = CONFIG_CATEGORIES.PAGE;
      break;
    // case EventType.SCREEN:
    //   category = CONFIG_CATEGORIES.SCREEN;
    //   break;
    // case EventType.TRACK:
    //   category = CONFIG_CATEGORIES.TRACK;
    //   break;
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
