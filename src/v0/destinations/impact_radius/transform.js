const sha1 = require("js-sha1");
const btoa = require("btoa");
const { EventType } = require("../../../constants");
const { CONFIG_CATEGORIES, MAPPING_CONFIG } = require("./config");
const {
  validateConfigFields,
  populateProductProperties,
  populateAdditionalParameters,
  checkOsAndPopulateValues
} = require("./util");
const {
  defaultRequestConfig,
  defaultPostRequestConfig,
  simpleProcessRouterDest,
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

/**
 * This function takes the transformed payload, endpoint and destination Config as input and returns the prepared response.
 * @param {*} payload
 * @param {*} endpoint
 * @param {*} Config
 * @returns
 */
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

/**
 * This function is used for building the transformed payload for the PageLoad endpoint of Impact Radius.
 * This function is called by default for identify, page and screen calls. For track call, it is called when
 * the customer doesn't configure the event name in config
 * @param {*} message
 * @param {*} campaignId
 * @param {*} impactAppId
 * @param {*} enableEmailHashing
 * @returns
 */
const buildPageLoadPayload = (
  message,
  campaignId,
  impactAppId,
  enableEmailHashing
) => {
  let payload = constructPayload(
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
  // populate deviceId and advertisingId checking OS value
  payload = checkOsAndPopulateValues(message, payload);
  return payload;
};

/**
 * This function is used for processing identify, page and screen calls.
 * @param {*} message
 * @param {*} category
 * @param {*} Config
 * @returns
 */
const processCommonEvents = (message, Config) => {
  const {
    campaignId,
    enableIdentifyEvents,
    enablePageEvents,
    enableScreenEvents,
    impactAppId,
    enableEmailHashing
  } = Config;

  if (message.type === "identify" && !enableIdentifyEvents) {
    throw new ConfigurationError(
      `${message.type} events are disabled from Config`
    );
  }
  if (message.type === "screen" && !enableScreenEvents) {
    throw new ConfigurationError(
      `${message.type} events are disabled from Config`
    );
  }
  if (message.type === "page" && !enablePageEvents) {
    throw new ConfigurationError(
      `${message.type} events are disabled from Config`
    );
  }

  return responseBuilder(
    buildPageLoadPayload(message, campaignId, impactAppId, enableEmailHashing),
    CONFIG_CATEGORIES.PAGELOAD.endPoint,
    Config
  );
};

/**
 * This function is used for processing the track events.
 * @param {*} message
 * @param {*} Config
 * @returns
 */
const processTrackEvent = (message, Config) => {
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

  const eventType = [];

  if (installEventNames && Array.isArray(installEventNames)) {
    installEventNames.forEach(event => {
      if (event.eventName === message.event) {
        eventType.push("install");
      }
    });
  }
  if (actionEventNames && Array.isArray(actionEventNames)) {
    actionEventNames.forEach(event => {
      if (event.eventName === message.event) {
        eventType.push("action");
      }
    });
  }

  if (
    !eventType.includes("install") &&
    message.event === "Applcation Installed"
  ) {
    eventType.push("install");
  } else if (
    !eventType.includes("action") &&
    message.event === "Order Completed"
  ) {
    eventType.push("action");
  }

  if (eventType.length) {
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

    // populate deviceId and advertisingId checking OS value
    payload = checkOsAndPopulateValues(message, payload);

    const productProperties = populateProductProperties(
      productsMapping,
      message.properties
    );
    const additionalParameters = populateAdditionalParameters(
      message,
      rudderToImpactProperty
    );

    payload = { ...payload, ...productProperties, ...additionalParameters };
    const endpoint = `${CONFIG_CATEGORIES.CONVERSION.base_url}${Config.accountSID}/Conversions`;
    const respArray = [];
    if (eventType.includes("install")) {
      respArray.push(responseBuilder(payload, endpoint, Config));
    }
    if (eventType.includes("action")) {
      payload.ClickId =
        message.context?.referrer?.id || message.properties?.clickId;
      respArray.push(responseBuilder(payload, endpoint, Config));
    }
    return respArray;
  }
  return responseBuilder(
    buildPageLoadPayload(message, campaignId, impactAppId),
    CONFIG_CATEGORIES.PAGELOAD.endPoint,
    Config
  );
};

const processEvent = (message, destination) => {
  if (!message.type) {
    throw new InstrumentationError("Event type is required");
  }
  const errorFields = validateConfigFields(destination.Config);
  if (errorFields) {
    throw new ConfigurationError(`${errorFields} : are required fields`);
  }

  const messageType = message.type?.toLowerCase();
  let response;
  switch (messageType) {
    case EventType.IDENTIFY:
    case EventType.PAGE:
    case EventType.SCREEN:
      response = processCommonEvents(message, destination.Config);
      break;
    case EventType.TRACK:
      response = processTrackEvent(message, destination.Config);
      break;
    default:
      throw new InstrumentationError(
        `Event type ${messageType} is not supported`
      );
  }
  return response;
};

const process = event => {
  return processEvent(event.message, event.destination);
};

const processRouterDest = async (inputs, reqMetadata) => {
  const respList = await simpleProcessRouterDest(inputs, process, reqMetadata);
  return respList;
};

module.exports = { process, processRouterDest };
