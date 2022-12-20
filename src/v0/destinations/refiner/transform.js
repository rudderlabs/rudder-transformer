const {
  defaultRequestConfig,
  simpleProcessRouterDest,
  removeUndefinedAndNullValues,
  defaultPostRequestConfig,
  TransformationError
} = require("../../util");
const {
  validatePayload,
  pageEventPayloadBuilder,
  groupUsersPayloadBuilder,
  trackEventPayloadBuilder,
  identifyUserPayloadBuilder
} = require("./utils");
const { DESTINATION } = require("./config");
const { EventType } = require("../../../constants");
const { TRANSFORMER_METRIC } = require("../../util/constant");

const responseBuilder = (payload, endpoint, destination) => {
  if (payload) {
    const response = defaultRequestConfig();
    const { apiKey } = destination.Config;
    response.endpoint = endpoint;
    response.headers = {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Bearer ${apiKey}`
    };
    response.method = defaultPostRequestConfig.requestMethod;
    response.body.FORM = removeUndefinedAndNullValues(payload);
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

const identifyResponseBuilder = (message, destination) => {
  validatePayload(message);
  const builder = identifyUserPayloadBuilder(message, destination);
  const { payload, endpoint } = builder;
  return responseBuilder(payload, endpoint, destination);
};

const trackResponseBuilder = (message, destination) => {
  validatePayload(message);
  if (!message.event) {
    throw new TransformationError(
      "Event name is required",
      400,
      {
        scope: TRANSFORMER_METRIC.MEASUREMENT_TYPE.TRANSFORMATION.SCOPE,
        meta: TRANSFORMER_METRIC.MEASUREMENT_TYPE.TRANSFORMATION.META.BAD_PARAM
      },
      DESTINATION
    );
  }
  const builder = trackEventPayloadBuilder(message);
  const { payload, endpoint } = builder;
  return responseBuilder(payload, endpoint, destination);
};

const pageResponseBuilder = (message, destination) => {
  validatePayload(message);
  const builder = pageEventPayloadBuilder(message);
  const { payload, endpoint } = builder;
  return responseBuilder(payload, endpoint, destination);
};

const groupResponseBuilder = (message, destination) => {
  validatePayload(message);
  const builder = groupUsersPayloadBuilder(message, destination);
  const { payload, endpoint } = builder;
  return responseBuilder(payload, endpoint, destination);
};

const processEvent = (message, destination) => {
  // Validating if message type is even given or not
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
    case EventType.IDENTIFY:
      response = identifyResponseBuilder(message, destination);
      break;
    case EventType.TRACK:
      response = trackResponseBuilder(message, destination);
      break;
    case EventType.PAGE:
      response = pageResponseBuilder(message, destination);
      break;
    case EventType.GROUP:
      response = groupResponseBuilder(message, destination);
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
  return simpleProcessRouterDest(inputs, "REFINER", process);
};

module.exports = { process, processRouterDest };
