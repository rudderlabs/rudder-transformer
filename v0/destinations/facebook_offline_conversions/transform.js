const {
  defaultRequestConfig,
  simpleProcessRouterDest,
  defaultPostRequestConfig
} = require("../../util");
const ErrorBuilder = require("../../util/error");
const { TRANSFORMER_METRIC } = require("../../util/constant");
const { offlineConversionResponseBuilder, prepareUrls } = require("./utils");
const { DESTINATION } = require("./config");
const { EventType } = require("../../../constants");

const responseBuilder = (endpoint, method) => {
  if (endpoint) {
    const response = defaultRequestConfig();
    response.endpoint = endpoint;
    response.method = method;
    return response;
  }
  // fail-safety for developer error
  throw new ErrorBuilder()
    .setMessage(
      "[Facebook Offline Conversions] :: Payload could not be constructed"
    )
    .setStatus(400)
    .setStatTags({
      destType: DESTINATION,
      stage: TRANSFORMER_METRIC.TRANSFORMER_STAGE.TRANSFORM,
      scope: TRANSFORMER_METRIC.MEASUREMENT_TYPE.TRANSFORMATION.SCOPE,
      meta: TRANSFORMER_METRIC.MEASUREMENT_TYPE.TRANSFORMATION.META.BAD_EVENT
    })
    .build();
};

const trackResponseBuilder = (metadata, message, destination) => {
  if (!message.event) {
    throw new ErrorBuilder()
      .setMessage(
        "[Facebook Offline Conversions] :: parameter event is required."
      )
      .setStatus(400)
      .setStatTags({
        destType: DESTINATION,
        stage: TRANSFORMER_METRIC.TRANSFORMER_STAGE.TRANSFORM,
        scope: TRANSFORMER_METRIC.MEASUREMENT_TYPE.TRANSFORMATION.SCOPE,
        meta: TRANSFORMER_METRIC.MEASUREMENT_TYPE.TRANSFORMATION.META.BAD_EVENT
      })
      .build();
  }

  const offlineConversionsPayload = offlineConversionResponseBuilder(
    message,
    destination
  );

  const urls = [];
  offlineConversionsPayload.forEach(item => {
    const { data, eventSetIds, payload } = item;
    urls.push(...prepareUrls(metadata, data, eventSetIds, payload));
  });

  const method = defaultPostRequestConfig.requestMethod;
  const eventsToSend = [];
  urls.forEach(url => {
    const response = responseBuilder(url, method);
    eventsToSend.push(response);
  });
  return eventsToSend;
};

const processEvent = (metadata, message, destination) => {
  // Validating if message type is even given or not
  if (!message.type) {
    throw new ErrorBuilder()
      .setMessage(
        "[Facebook Offline Conversions] :: Message Type is not present. Aborting message."
      )
      .setStatus(400)
      .setStatTags({
        destType: DESTINATION,
        stage: TRANSFORMER_METRIC.TRANSFORMER_STAGE.TRANSFORM,
        scope: TRANSFORMER_METRIC.MEASUREMENT_TYPE.TRANSFORMATION.SCOPE,
        meta: TRANSFORMER_METRIC.MEASUREMENT_TYPE.TRANSFORMATION.META.BAD_EVENT
      })
      .build();
  }
  const messageType = message.type.toLowerCase();

  if (messageType === EventType.TRACK) {
    return trackResponseBuilder(metadata, message, destination);
  }

  throw new ErrorBuilder()
    .setMessage(
      `[Facebook Offline Conversions] :: Message type ${messageType} not supported.`
    )
    .setStatus(400)
    .setStatTags({
      destType: DESTINATION,
      stage: TRANSFORMER_METRIC.TRANSFORMER_STAGE.TRANSFORM,
      scope: TRANSFORMER_METRIC.MEASUREMENT_TYPE.TRANSFORMATION.SCOPE,
      meta: TRANSFORMER_METRIC.MEASUREMENT_TYPE.TRANSFORMATION.META.BAD_EVENT
    })
    .build();
};

const process = event => {
  const res = processEvent(event.metadata, event.message, event.destination);
  return res;
};

const processRouterDest = async inputs => {
  const respList = await simpleProcessRouterDest(
    inputs,
    "FACEBOOK_OFFLINE_CONVERSIONS",
    process
  );
  return respList;
};

module.exports = { process, processRouterDest };
