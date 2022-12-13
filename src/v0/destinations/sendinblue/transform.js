/* eslint-disable camelcase */
const { EventType } = require("../../../constants");
const {
  defaultRequestConfig,
  simpleProcessRouterDest,
  constructPayload,
  removeUndefinedAndNullValues,
  defaultPostRequestConfig,
  TransformationError
} = require("../../util");
const { getIntegrationsObj } = require("../../util");
const { CONFIG_CATEGORIES, MAPPING_CONFIG } = require("./config");
const { TRANSFORMER_METRIC } = require("../../util/constant");
const { DESTINATION } = require("./config");
const {
  checkIfEmailAndPhoneExists,
  prepareEmailFromPhone,
  validateEmailAndPhone
} = require("./util");

const responseBuilder = (payload, endpoint, destination) => {
  if (payload) {
    const response = defaultRequestConfig();
    const { apiKey } = destination.Config;
    response.endpoint = endpoint;
    response.headers = {
      "Content-Type": "application/json",
      Authorization: `Basic ${apiKey}`
    };
    response.method = defaultPostRequestConfig.requestMethod;
    response.body.JSON = removeUndefinedAndNullValues(payload);
    return response;
  }
  // fail-safety for developer error
  throw new TransformationError(
    "Something went wrong while constructing the payload",
    400,
    {
      scope: TRANSFORMER_METRIC.MEASUREMENT_TYPE.TRANSFORMATION.SCOPE,
      meta: TRANSFORMER_METRIC.MEASUREMENT_TYPE.TRANSFORMATION.META.BAD_EVENT
    },
    DESTINATION
  );
};

// ref:- https://tracker-doc.sendinblue.com/reference/trackevent-3
const trackEvent = (message, destination) => {
  const { endpoint } = CONFIG_CATEGORIES.TRACK_EVENTS;
  let payload = constructPayload(
    message,
    MAPPING_CONFIG[CONFIG_CATEGORIES.TRACK_EVENTS.name]
  );

  checkIfEmailAndPhoneExists(payload);

  if (!payload.email) {
    payload.email = prepareEmailFromPhone(payload.phone);
  }

  validateEmailAndPhone(payload);

  const { messageId, data, properties, ...rest } = payload;
  const integrationsObj = getIntegrationsObj(message, "sendinblue");
  const idKey = integrationsObj?.propertiesIdKey;
  const id = properties[idKey] || messageId;
  const eventdata = { id, data };

  payload = { ...rest, properties, eventdata };

  return responseBuilder(payload, endpoint, destination);
};

// ref:- https://tracker-doc.sendinblue.com/reference/tracklink-3
const trackLink = (message, destination) => {
  const { endpoint } = CONFIG_CATEGORIES.TRACK_LINK;
  const payload = constructPayload(
    message,
    MAPPING_CONFIG[CONFIG_CATEGORIES.TRACK_LINK.name]
  );

  checkIfEmailAndPhoneExists(payload);

  if (!payload.email) {
    payload.email = prepareEmailFromPhone(payload.phone);
  }

  validateEmailAndPhone(payload);
  return responseBuilder(payload, endpoint, destination);
};

const trackResponseBuilder = (message, destination) => {
  const { event } = message;
  if (
    event.toLowerCase() === CONFIG_CATEGORIES.TRACK_LINK.eventName.toLowerCase()
  ) {
    return trackLink(message, destination);
  }

  return trackEvent(message, destination);
};

// ref :- https://tracker-doc.sendinblue.com/reference/trackpage-3
const pageResponseBuilder = (message, destination) => {
  const { endpoint } = CONFIG_CATEGORIES.PAGE;
  let payload = constructPayload(
    message,
    MAPPING_CONFIG[CONFIG_CATEGORIES.PAGE.name]
  );

  checkIfEmailAndPhoneExists(payload);

  if (!payload.email) {
    payload.email = prepareEmailFromPhone(payload.phone);
  }

  validateEmailAndPhone(payload);

  const {
    ma_title,
    ma_path,
    ma_referrer,
    sib_name,
    properties,
    ...rest
  } = payload;

  const propertiesObject = {
    ma_title,
    ma_path,
    ma_referrer,
    sib_name,
    ...properties
  };

  payload = { ...rest, properties: propertiesObject };

  return responseBuilder(payload, endpoint, destination);
};

const processEvent = (message, destination) => {
  if (!message.type) {
    throw new TransformationError(
      "Event type is required",
      400,
      {
        scope: TRANSFORMER_METRIC.MEASUREMENT_TYPE.TRANSFORMATION.SCOPE,
        meta: TRANSFORMER_METRIC.MEASUREMENT_TYPE.TRANSFORMATION.META.BAD_EVENT
      },
      DESTINATION
    );
  }

  const messageType = message.type.toLowerCase();
  let response;
  switch (messageType) {
    case EventType.TRACK:
      response = trackResponseBuilder(message, destination);
      break;
    case EventType.PAGE:
      response = pageResponseBuilder(message, destination);
      break;
    default:
      throw new TransformationError(
        `Event type "${messageType}" is not supported`,
        400,
        {
          scope: TRANSFORMER_METRIC.MEASUREMENT_TYPE.TRANSFORMATION.SCOPE,
          meta:
            TRANSFORMER_METRIC.MEASUREMENT_TYPE.TRANSFORMATION.META
              .INSTRUMENTATION
        },
        DESTINATION
      );
  }
  return response;
};

const process = event => {
  return processEvent(event.message, event.destination);
};

const processRouterDest = async inputs => {
  const respList = await simpleProcessRouterDest(inputs, DESTINATION, process);
  return respList;
};

module.exports = { process, processRouterDest };
