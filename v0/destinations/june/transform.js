const { EventType } = require("../../../constants");
const {
  defaultRequestConfig,
  simpleProcessRouterDest,
  constructPayload,
  removeUndefinedAndNullValues,
  defaultPostRequestConfig,
  getDestinationExternalID
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

// ref :- https://www.june.so/docs/api#:~:text=Copy-,Identifying%20users,-You%20can%20use
const identifyResponseBuilder = (message, destination) => {
  const { endpoint } = CONFIG_CATEGORIES.IDENTIFY;
  const payload = constructPayload(
    message,
    MAPPING_CONFIG[CONFIG_CATEGORIES.IDENTIFY.name]
  );
  return responseBuilder(payload, endpoint, destination);
};

// ref :- https://www.june.so/docs/api#:~:text=Copy-,Send%20track%20events,-In%20order%20to
const trackResponseBuilder = (message, destination) => {
  const { endpoint } = CONFIG_CATEGORIES.TRACK;
  const groupId =
    getDestinationExternalID(message, "juneGroupId") ||
    message.properties?.groupId;
  let payload = constructPayload(
    message,
    MAPPING_CONFIG[CONFIG_CATEGORIES.TRACK.name]
  );

  if (groupId) {
    payload = { ...payload, context: { groupId } };
  }

  return responseBuilder(payload, endpoint, destination);
};

// ref :- https://www.june.so/docs/api#:~:text=Copy-,Identifying%20companies,-(optional)
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
