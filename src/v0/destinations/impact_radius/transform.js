const get = require("get-value");
const sha1 = require("js-sha1");
const btoa = require("btoa");
const { EventType } = require("../../../constants");
const { CONFIG_CATEGORIES, MAPPING_CONFIG } = require("./config");
const {
  checkConfigurationError,
  populateProductProperties,
  populateAdditionalParameters
} = require("./util");
const {
  defaultRequestConfig,
  defaultPostRequestConfig,
  simpleProcessRouterDest,
  isAppleFamily,
  constructPayload,
  isDefinedAndNotNull,
  removeUndefinedAndNullValues,
  isDefinedAndNotNullAndNotEmpty
} = require("../../util");
const {
  ConfigurationError,
  TransformationError,
  InstrumentationError
} = require("../../util/errorTypes");

const responseBuilder = (payload, endpoint, Config) => {
  if (payload) {
    const response = defaultRequestConfig();
    response.endpoint = endpoint;
    response.headers = {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${btoa(`${Config.accountSID}:${Config.apiKey}`)}`
    };
    response.method = defaultPostRequestConfig.requestMethod;
    response.body.FORM = removeUndefinedAndNullValues(payload);
    return response;
  }
  throw new TransformationError(
    "Payload could not be populated due to wrong input"
  );
};

const buildPageLoadResponse = (
  message,
  campaignId,
  impactAppId,
  enableEmailHashing
) => {
  const payload = constructPayload(
    message,
    MAPPING_CONFIG[CONFIG_CATEGORIES.PAGELOAD.name]
  );
  if (isDefinedAndNotNull(payload.CustomerEmail)) {
    payload.CustomerEmail = enableEmailHashing
      ? sha1(payload?.CustomerEmail)
      : payload?.CustomerEmail;
  }
  payload.CampaignId = campaignId;
  if (isDefinedAndNotNullAndNotEmpty(impactAppId)) {
    payload.PropertyId = impactAppId;
    payload.ImpactAppId = impactAppId;
  }

  const os = get(message, "context.os.name");
  if (os && isAppleFamily(os.toLowerCase())) {
    payload.AppleIfv = get(message, "context.device.id");
    payload.AppleIfa = get(message, "context.device.advertisingId");
  } else if (os && os.toLowerCase() === "android") {
    payload.AndroidId = get(message, "context.device.id");
    payload.GoogAId = get(message, "context.device.advertisingId");
  }
  return payload;
};

/**
 * This function is used to build the response for identify call.
 * @param {*} message
 * @param {*} category
 * @param {*} Config
 * @returns
 */
const identifyResponseBuilder = (message, Config) => {
  const {
    campaignId,
    enableIdentifyEvents,
    impactAppId,
    enableEmailHashing
  } = Config;

  if (!enableIdentifyEvents) {
    throw new ConfigurationError(
      `${message.type} events are disabled from Config`
    );
  }

  return responseBuilder(
    buildPageLoadResponse(message, campaignId, impactAppId, enableEmailHashing),
    CONFIG_CATEGORIES.PAGELOAD.endPoint,
    Config
  );
};

/**
 * This function is used to build the response for track call.
 * @param {*} message
 * @param {*} Config
 * @returns
 */
const trackResponseBuilder = (message, Config) => {
  const {
    campaignId,
    eventTypeId,
    impactAppId,
    enableEmailHashing,
    actionEventNames,
    installEventNames,
    rudderToImpactProperty,
    productsMapping
  } = Config;

  let eventType;

  if (installEventNames && Array.isArray(installEventNames)) {
    installEventNames.forEach(event => {
      if (event.eventName === message.event) {
        eventType = "install";
      }
    });
  }
  if (actionEventNames && Array.isArray(actionEventNames)) {
    actionEventNames.forEach(event => {
      if (event.eventName === message.event) {
        eventType = "action";
      }
    });
  }
  if (!eventType) {
    if (message.event === "Applcation Installed") {
      eventType = "install";
    } else if (message.event === "Order Completed") {
      eventType = "action";
    }
  }

  if (eventType === "action") {
    let payload = constructPayload(
      message,
      MAPPING_CONFIG[CONFIG_CATEGORIES.CONVERSION.name]
    );
    payload.CampaignId = campaignId;
    payload.EventTypeId = eventTypeId;
    payload.ImpactAppId = impactAppId;
    if (isDefinedAndNotNull(payload.CustomerEmail)) {
      payload.CustomerEmail = enableEmailHashing
        ? sha1(payload?.CustomerEmail)
        : payload?.CustomerEmail;
    }
    const os = get(message, "context.os.name");
    if (os && isAppleFamily(os.toLowerCase())) {
      payload.AppleIfv = get(message, "context.device.id");
      payload.AppleIfa = get(message, "context.device.advertisingId");
    } else if (os && os.toLowerCase() === "android") {
      payload.AndroidId = get(message, "context.device.id");
      payload.GoogAId = get(message, "context.device.advertisingId");
    }
    const productProperties = populateProductProperties(
      productsMapping,
      message.properties
    );
    const additionalParameters = populateAdditionalParameters(
      message,
      rudderToImpactProperty
    );
    if (eventType === "install" && payload.ClickId) {
      delete payload.ClickId;
    }
    payload = { ...payload, ...productProperties, ...additionalParameters };

    const endpoint = `${CONFIG_CATEGORIES.CONVERSION.base_url}${Config.accountSID}/Conversions`;
    return responseBuilder(payload, endpoint, Config);
  }
  return responseBuilder(
    buildPageLoadResponse(message, campaignId, impactAppId),
    CONFIG_CATEGORIES.PAGELOAD.endPoint,
    Config
  );
};

/**
 * This function is used to build the response for page call.
 * @param {*} message
 * @param {*} Config
 * @returns
 */
const pageResponseBuilder = (message, Config) => {
  const {
    campaignId,
    enablePageEvents,
    impactAppId,
    enableEmailHashing
  } = Config;

  if (!enablePageEvents) {
    throw new ConfigurationError(
      `${message.type} events are disabled from Config`
    );
  }

  return responseBuilder(
    buildPageLoadResponse(message, campaignId, impactAppId, enableEmailHashing),
    CONFIG_CATEGORIES.PAGELOAD.endPoint,
    Config
  );
};

/**
 * This function is used to build the response for screen call.
 * @param {*} message
 * @param {*} Config
 * @returns
 */
const screenResponseBuilder = (message, Config) => {
  const {
    campaignId,
    enableScreenEvents,
    impactAppId,
    enableEmailHashing
  } = Config;

  if (!enableScreenEvents) {
    throw new ConfigurationError(
      `${message.type} events are disabled from Config`
    );
  }

  return responseBuilder(
    buildPageLoadResponse(message, campaignId, impactAppId, enableEmailHashing),
    CONFIG_CATEGORIES.PAGELOAD.endPoint,
    Config
  );
};

const processEvent = async (message, destination) => {
  if (!message.type) {
    throw new InstrumentationError("Event type is required");
  }
  if (checkConfigurationError(destination.Config)) {
    const configField = checkConfigurationError(destination.Config);
    throw new ConfigurationError(`${configField} is a required field`);
  }

  const messageType = message.type?.toLowerCase();
  let response;
  switch (messageType) {
    case EventType.IDENTIFY:
      response = identifyResponseBuilder(message, destination.Config);
      break;
    case EventType.TRACK:
      response = trackResponseBuilder(message, destination.Config);
      break;
    case EventType.PAGE:
      response = pageResponseBuilder(message, destination.Config);
      break;
    case EventType.SCREEN:
      response = screenResponseBuilder(message, destination.Config);
      break;
    default:
      throw new InstrumentationError(
        `Event type ${messageType} is not supported`
      );
  }
  return response;
};

const process = async event => {
  return processEvent(event.message, event.destination);
};

const processRouterDest = async (inputs, reqMetadata) => {
  const respList = await simpleProcessRouterDest(inputs, process, reqMetadata);
  return respList;
};

module.exports = { process, processRouterDest };
