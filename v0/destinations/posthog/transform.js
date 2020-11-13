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

// Logic To match destination Property key that is in Rudder Stack Properties Object.
const generatePropertyDefination = message => {
  const PHPropertyJson = CONFIG_CATEGORIES.PROPERTY.name;
  let propertyJson = MAPPING_CONFIG[PHPropertyJson];
  let data = {};

  if (message.channel === "mobile") {
    propertyJson = propertyJson.filter(d => {
      return d.isScreen || d.all;
    });
  } else {
    propertyJson = propertyJson.filter(d => {
      return !d.isScreen || d.all;
    });
  }

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
  data = {
    ...constructPayload(message, propertyJson),
    ...data
  };

  if (message.type === EventType.SCREEN) {
    data.$screen_name = message.event;
  }

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
    ? `${destination.Config.yourInstance}/batch`
    : `${DEFAULT_BASE_ENDPOINT}/batch`;
  response.method = defaultPostRequestConfig.requestMethod;
  response.headers = {
    "Content-Type": "application/json"
  };
  response.body.JSON = responseBody;
  return response;
};

// Validate Message Type coming from source
const validateMessageType = message => {
  if (!message.type) {
    throw Error(ErrorMessage.TypeNotFound);
  }

  const category = CONFIG_CATEGORIES[message.type.toUpperCase()];
  if (!category) {
    throw Error(ErrorMessage.TypeNotSupported);
  }
};

const processEvent = (message, destination) => {
  validateMessageType(message);

  const messageType = message.type.toLowerCase();

  const repList = [];

  const category = CONFIG_CATEGORIES[messageType.toUpperCase()];
  if (EventType.TRACK === messageType) {
    // eslint-disable-next-line no-param-reassign
    message.type = CONFIG_CATEGORIES.TRACK.type;
  }
  repList.push(responseBuilderSimple(message, category, destination));
  return repList;
};

const process = event => {
  return processEvent(event.message, event.destination);
};

exports.process = process;
