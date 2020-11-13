const { EventType } = require("../../../constants");
const {
  DEFAULT_BASE_ENDPOINT,
  CONFIG_CATEGORIES,
  MAPPING_CONFIG
} = require("./config");
const {
  defaultRequestConfig,
  getBrowserInfo,
  getDeviceModel,
  constructPayload,
  defaultPostRequestConfig,
  ErrorMessage
} = require("../../util");

const isValidUrl = url => {
  try {
    // eslint-disable-next-line no-new
    new URL(url);
    return true;
  } catch (err) {
    return false;
  }
};

const stripTrailingSlash = str => {
  return str.endsWith("/") ? str.slice(0, -1) : str;
};

// Logic To match destination Property key that is in Rudder Stack Properties Object.
const generatePropertyDefination = message => {
  const PHPropertyJson = CONFIG_CATEGORIES.PROPERTY.name;
  let propertyJson = MAPPING_CONFIG[PHPropertyJson];
  let data = {};

  // Filter out property specific to mobile or web. isMobile key takes care of it.
  // Array Filter() will map propeerty on basis of given condition and filters it.
  if (message.channel === "mobile") {
    propertyJson = propertyJson.filter(d => {
      return d.isMobile || d.all;
    });
  } else {
    propertyJson = propertyJson.filter(d => {
      return !d.isMobile || d.all;
    });
  }

  data = constructPayload(message, propertyJson);

  // This logic ensures to get browser info only for payload generated from web.
  if (
    message.channel === "web" &&
    message.context &&
    message.context.userAgent
  ) {
    const browser = getBrowserInfo(message.context.userAgent);
    const osInfo = getDeviceModel(message);
    data.$os = osInfo;
    data.$browser = browser.name;
    data.$browser_version = browser.version;
  }

  // For EventType Screen Posthog maps screen name to our event property.
  if (message.type === EventType.SCREEN) {
    data.$screen_name = message.event;
  }

  // Validate current url from payload and generate host form that url.
  if (isValidUrl(data.$current_url) && !data.$host) {
    const url = new URL(data.$current_url);
    data.$host = url.host;
  }

  return data;
};

const responseBuilderSimple = (message, category, destination) => {
  const payload = constructPayload(message, MAPPING_CONFIG[category.name]);
  if (!payload) {
    // fail-safety for developer error
    // eslint-disable-next-line no-undef
    throw Error(ErrorMessage.FailedToConstructPayload);
  }

  payload.properties = {
    ...generatePropertyDefination(message),
    ...payload.properties
  };

  // Mapping Destination Event with correct value
  if (category.type !== CONFIG_CATEGORIES.TRACK.type) {
    payload.event = category.event;
  }

  const responseBody = {
    ...payload,
    api_key: destination.Config.teamApiKey,
    type: category.type
  };
  const response = defaultRequestConfig();
  response.endpoint = destination.Config.yourInstance
    ? `${stripTrailingSlash(destination.Config.yourInstance)}/batch`
    : `${DEFAULT_BASE_ENDPOINT}/batch`;
  response.method = defaultPostRequestConfig.requestMethod;
  response.headers = {
    "Content-Type": "application/json"
  };
  response.body.JSON = responseBody;
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

  const messageType = message.type.toLowerCase();

  if (EventType.TRACK === messageType) {
    // eslint-disable-next-line no-param-reassign
    message.type = CONFIG_CATEGORIES.TRACK.type;
  }
  return responseBuilderSimple(message, category, destination);
};

const process = event => {
  return processEvent(event.message, event.destination);
};

exports.process = process;
