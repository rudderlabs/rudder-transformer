/* eslint-disable no-underscore-dangle */
const { EventType } = require("../../../constants");
const { CONFIG_CATEGORIES, MAPPING_CONFIG } = require("./config");
const {
  constructPayload,
  defaultRequestConfig,
  defaultGetRequestConfig,
  getFieldValueFromMessage
} = require("../../util");

const formatRevenue = revenue => {
  let rev = revenue;
  rev = parseFloat(revenue.replace(/^[^\d.]*/, ""));
  return rev;
};

const responseBuilderSimple = (message, category, destination) => {
  const payload = constructPayload(message, MAPPING_CONFIG[category.name]);
  let event;
  payload.idsite = destination.Config.brandId;
  payload.rec = 1;
  payload.rand = Math.round(Math.random() * 1000).toString();
  let cvarAction;
  const cvarSession = constructPayload(
    message,
    MAPPING_CONFIG[CONFIG_CATEGORIES._CVAR.name]
  );
  cvarSession.medium = "app";
  if (category.type === "Action") {
    cvarSession.user = getFieldValueFromMessage(message, "userId");
    cvarAction = constructPayload(
      message,
      MAPPING_CONFIG[CONFIG_CATEGORIES.CVAR.name]
    );
    cvarAction.medium = "app";
    cvarAction.promo = cvarAction.promo || "";
    cvarAction.prod = cvarAction.prod || "";
    cvarAction.rev = message.properties.revenue
      ? formatRevenue(cvarAction.rev)
      : null;
    cvarAction.dev = cvarAction.dev || "";
    event = message.event;
    if (event === "Application Opened") {
      event = "app open";
    } else if (event === "Application Installed") {
      event = "install";
    }
    payload.cvar = encodeURIComponent(
      JSON.stringify({
        "5": [event || "", cvarAction]
      })
    );
  }
  payload._cvar = encodeURIComponent(
    JSON.stringify({
      "5": ["session", cvarSession]
    })
  );
  if (payload) {
    const response = defaultRequestConfig();
    response.method = defaultGetRequestConfig.requestMethod;
    response.userId = getFieldValueFromMessage(message, "userId");
    response.params = { ...payload };
    // https://collector-XXXX.tvsquared.com/tv2track.php
    response.endpoint = `https://collector-${destination.Config.clientId}.tvsquared.com/tv2track.php`;
    return response;
  }
  // fail-safety for developer error
  throw new Error("Payload could not be constructed");
};

const processEvent = (message, destination) => {
  if (!message.type) {
    throw Error("Message Type is not present. Aborting message.");
  }
  const messageType = message.type.toLowerCase();
  let category;
  switch (messageType) {
    case EventType.TRACK:
      category = CONFIG_CATEGORIES.TRACK;
      break;
    case EventType.IDENTIFY:
      category = CONFIG_CATEGORIES.IDENTIFY;
      break;
    default:
      throw new Error("Message type not supported");
  }

  return responseBuilderSimple(message, category, destination);
};

const process = event => {
  try {
    return processEvent(event.message, event.destination);
  } catch (error) {
    throw new Error(error.message || "Unknown error");
  }
};

exports.process = process;
