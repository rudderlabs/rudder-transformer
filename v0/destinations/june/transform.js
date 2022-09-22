const { EventType } = require("../../../constants");
const {
  defaultRequestConfig,
  simpleProcessRouterDest,
  constructPayload,
  removeUndefinedAndNullValues,
  defaultPostRequestConfig
} = require("../../util");
const { CONFIG_CATEGORIES, MAPPING_CONFIG } = require("./config");
const { TRANSFORMER_METRIC } = require("../../util/constant");
const ErrorBuilder = require("../../util/error");
const { DESTINATION } = require("./config");

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
  throw new ErrorBuilder()
    .setMessage("Payload could not be constructed")
    .setStatus(400)
    .setStatTags({
      destType: DESTINATION,
      stage: TRANSFORMER_METRIC.TRANSFORMER_STAGE.TRANSFORM,
      scope: TRANSFORMER_METRIC.MEASUREMENT_TYPE.TRANSFORMATION.SCOPE,
      meta: TRANSFORMER_METRIC.MEASUREMENT_TYPE.TRANSFORMATION.META.BAD_PARAM
    })
    .build();
};

const identifyResponseBuilder = (message, destination) => {
  const { endpoint } = CONFIG_CATEGORIES.IDENTIFY;
  const payload = constructPayload(
    message,
    MAPPING_CONFIG[CONFIG_CATEGORIES.IDENTIFY.name]
  );
  return responseBuilder(payload, endpoint, destination);
};

const trackResponseBuilder = (message, destination) => {
  const { endpoint } = CONFIG_CATEGORIES.TRACK;
  const { groupId } = message.properties || {};
  let payload = constructPayload(
    message,
    MAPPING_CONFIG[CONFIG_CATEGORIES.TRACK.name]
  );

  if (groupId) {
    payload = { ...payload, context: { groupId } };
  }

  return responseBuilder(payload, endpoint, destination);
};

const groupResponseBuilder = (message, destination) => {
  const { endpoint } = CONFIG_CATEGORIES.GROUP;
  const payload = constructPayload(
    message,
    MAPPING_CONFIG[CONFIG_CATEGORIES.GROUP.name]
  );
  return responseBuilder(payload, endpoint, destination);
};

const processEvent = (message, destination) => {
  if (!message.type) {
    throw new ErrorBuilder()
      .setMessage("Message Type is not present. Aborting message.")
      .setStatus(400)
      .setStatTags({
        destType: DESTINATION,
        stage: TRANSFORMER_METRIC.TRANSFORMER_STAGE.TRANSFORM,
        scope: TRANSFORMER_METRIC.MEASUREMENT_TYPE.TRANSFORMATION.SCOPE,
        meta: TRANSFORMER_METRIC.MEASUREMENT_TYPE.TRANSFORMATION.META.BAD_PARAM
      })
      .build();
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
    case EventType.GROUP:
      response = groupResponseBuilder(message, destination);
      break;
    default:
      throw new ErrorBuilder()
        .setMessage(`Message type ${messageType} not supported.`)
        .setStatus(400)
        .setStatTags({
          destType: DESTINATION,
          stage: TRANSFORMER_METRIC.TRANSFORMER_STAGE.TRANSFORM,
          scope: TRANSFORMER_METRIC.MEASUREMENT_TYPE.TRANSFORMATION.SCOPE,
          meta:
            TRANSFORMER_METRIC.MEASUREMENT_TYPE.TRANSFORMATION.META.BAD_PARAM
        })
        .build();
  }
  return response;
};

const process = event => {
  return processEvent(event.message, event.destination);
};

const processRouterDest = async inputs => {
  const respList = await simpleProcessRouterDest(inputs, "JUNE", process);
  return respList;
};

module.exports = { process, processRouterDest };
