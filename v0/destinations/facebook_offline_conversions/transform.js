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

const responseBuilder = endpoint => {
  if (endpoint) {
    const response = defaultRequestConfig();
    response.endpoint = endpoint;
    response.method = defaultPostRequestConfig.requestMethod;
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

const trackResponseBuilder = (message, destination) => {
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

  const offlineConversionsPayloads = offlineConversionResponseBuilder(
    message,
    destination
  );

  const finalResponseUrls = [];
  offlineConversionsPayloads.forEach(item => {
    const { data, eventSetIds, payload } = item;
    finalResponseUrls.push(
      ...prepareUrls(destination, data, eventSetIds, payload)
    );
  });

  const eventsToSend = [];
  finalResponseUrls.forEach(url => {
    const response = responseBuilder(url);
    eventsToSend.push(response);
  });
  return eventsToSend;
};

const processEvent = (message, destination) => {
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
    return trackResponseBuilder(message, destination);
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
  const res = processEvent(event.message, event.destination);
  return res;
};

const processRouterDest = async inputs => {
  return simpleProcessRouterDest(
    inputs,
    "FACEBOOK_OFFLINE_CONVERSIONS",
    process
  );
};

module.exports = { process, processRouterDest };
