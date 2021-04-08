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
  ErrorMessage,
  isValidUrl,
  stripTrailingSlash
} = require("../../util");

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
  const url = isValidUrl(data.$current_url);
  if (url) {
    data.$host = url.host;
  }

  return data;
};

const responseBuilderSimple = (message, category, destination) => {
  const payload = constructPayload(message, MAPPING_CONFIG[category.name]);
  if (!payload) {
    // fail-safety for developer error
    throw Error(ErrorMessage.FailedToConstructPayload);
  }

  payload.properties = {
    ...generatePropertyDefination(message),
    ...payload.properties
  };

  // Convert the distinct_id to string as that is the needed type in destinations.
  if (payload.distinct_id) {
    payload.distinct_id = payload.distinct_id.toString();
  }
  if (payload.properties.distinct_id) {
    payload.properties.distinct_id = payload.properties.distinct_id.toString();
  }

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
  response.endpoint = `${stripTrailingSlash(destination.Config.yourInstance) ||
    DEFAULT_BASE_ENDPOINT}/batch`;
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

  return responseBuilderSimple(message, category, destination);
};

const process = event => {
  return processEvent(event.message, event.destination);
};

exports.process = process;
