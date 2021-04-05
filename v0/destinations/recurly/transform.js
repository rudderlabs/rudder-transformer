const btoa = require("btoa");
const { EventType } = require("../../../constants");
const {
  ACCEPT_HEADERS,
  DEFAULT_BASE_ENDPOINT,
  CONFIG_CATEGORIES,
  MAPPING_CONFIG,
  BILL_TO_SELF,
  BILL_TO_PARENT
} = require("./config");
const {
  defaultRequestConfig,
  ErrorMessage,
  defaultPostRequestConfig,
  constructPayload,
  stripTrailingSlash
} = require("../../util");

/**
 * Backup Code If required
 * @param {*} isSubDomain
 * @param {*} name
 * @returns
 */
const appendSubDomain = (isSubDomain, name) => {
  return isSubDomain ? `${name}-recurly` : "";
};

const processIdentify = (message, category) => {
  const { address } = constructPayload(
    message,
    MAPPING_CONFIG[CONFIG_CATEGORIES.ADDRESS.name]
  );
  address.postal_code = address.postal_code.toString();
  const payload = {
    ...constructPayload(message, MAPPING_CONFIG[category.name]),
    address
  };
  payload.bill_to = BILL_TO_SELF;
  if (!payload) {
    // fail-safety for developer error
    throw Error(ErrorMessage.FailedToConstructPayload);
  }
  return payload;
};

const processTrack = (message, category) => {
  return {};
};

const processGroup = (message, category) => {
  return {};
};

const responseBuilderSimple = (message, category, destination) => {
  let payload;
  switch (message.type) {
    case EventType.IDENTIFY:
      payload = processIdentify(message, category);
      break;
    case EventType.GROUP:
      payload = processGroup(message, category);
      break;
    case EventType.TRACK:
      payload = processTrack(message, category);
      break;
    default:
      break;
  }
  const response = defaultRequestConfig();
  response.endpoint = `${stripTrailingSlash(destination.Config.siteId) ||
    DEFAULT_BASE_ENDPOINT}${
    CONFIG_CATEGORIES[message.type.toUpperCase()].relativeURI
  }`;

  response.method = defaultPostRequestConfig.requestMethod;
  response.headers = {
    "Content-Type": "application/json",
    Accept: ACCEPT_HEADERS,
    Authorization: `Basic ${btoa(`${destination.Config.apiKey}:`)}`
  };
  response.body.JSON = payload;
  return response;
};

const processEvent = (message, destination) => {
  if (!message.type) {
    throw Error(ErrorMessage.TypeNotFound);
  }
  const category = CONFIG_CATEGORIES[message.type.toUpperCase()];
  if (!category) {
    throw Error(ErrorMessage.TypeNotSupported);
  }
  return responseBuilderSimple(message, category, destination);
};

const process = event => {
  return processEvent(event.message, event.destination);
};

exports.process = process;
