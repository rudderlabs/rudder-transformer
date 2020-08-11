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
  let whitelist;
  let customMetrics;
  let i;
  let j;
  let key;
  let value;

  payload.idsite = destination.Config.brandId;
  payload.rec = 1;
  let cvarAction;
  const cvarSession = constructPayload(
    message,
    MAPPING_CONFIG[CONFIG_CATEGORIES._CVAR.name]
  );
  cvarSession.medium = "app";
  cvarSession.source = "RudderStack";
  if (category.type === "Action" || category.type === "Page&Screen") {
    // as list cannot be deleted so will check for empty inputs
    whitelist = destination.Config.eventWhiteList.slice();
    whitelist = whitelist.filter(wl => {
      return wl.event !== "";
    });
    for (i = 0; i < whitelist.length; i += 1) {
      if (message.event.toUpperCase() === whitelist[i].event.toUpperCase()) {
        break;
      }
      if (i === whitelist.length - 1) {
        throw new Error("Event not whitelisted");
      }
    }
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
    cvarAction.source = "RudderStack";
    event = message.event;
    if (event === "Application Opened") {
      event = "app open";
    } else if (event === "Application Installed") {
      event = "install";
    } else if (event === "Response" || event === "All response") {
      throw new Error(
        `${event} event is a reserved word for tvsquared thus can not be sent.`
      );
    }
    customMetrics = destination.Config.customMetrics.slice();
    customMetrics = customMetrics.filter(cm => {
      return cm.propertyName !== "";
    });
    if (customMetrics.length) {
      for (j = 0; j < customMetrics.length; j += 1) {
        key = customMetrics[j].propertyName;
        value = message.properties[key];
        if (value) {
          cvarAction[key] = value;
        }
      }
    }
    if (category.type === "Page&Screen") {
      event = `Page ${message.name} viewed`;
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
    case EventType.PAGE:
    case EventType.SCREEN:
      category = CONFIG_CATEGORIES.PAGEandSCREEN;
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
