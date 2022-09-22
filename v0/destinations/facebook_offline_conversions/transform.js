const {
  CustomError,
  getErrorRespEvents,
  defaultRequestConfig,
  getSuccessRespEvents,
  defaultPostRequestConfig
} = require("../../util");
const ErrorBuilder = require("../../util/error");
const { TRANSFORMER_METRIC } = require("../../util/constant");
const { offlineConversionResponseBuilder, prepareUrls } = require("./utils");
const { DESTINATION } = require("./config");
const { EventType } = require("../../../constants");

const responseBuilder = (payload, endpoint, method) => {
  if (payload) {
    const response = defaultRequestConfig();
    response.endpoint = endpoint;
    response.method = method;
    response.headers = {
      Cookie: "sb=uTrDYKJtnSNLaphIKQpOYiDz"
    };
    return response;
  }
  // fail-safety for developer error
  throw new CustomError(
    "[Facebook Offline Conversions] :: Payload could not be constructed",
    400
  );
};

const trackResponseBuilder = (metadata, message, destination) => {
  if (!message.event) {
    throw new CustomError(
      "[Facebook Offline Conversions] :: parameter event is required",
      400
    );
  }

  const builder = offlineConversionResponseBuilder(message, destination);
  const { payload, data, eventSetIds } = builder;
  const urls = prepareUrls(metadata, data, eventSetIds, payload);
  const method = defaultPostRequestConfig.requestMethod;
  const eventsToSend = [];
  urls.forEach(url => {
    const response = responseBuilder(payload, url, method);
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

const processRouterDest = inputs => {
  if (!Array.isArray(inputs) || inputs.length <= 0) {
    const respEvents = getErrorRespEvents(null, 400, "Invalid event array");
    return [respEvents];
  }

  return Promise.all(
    inputs.map(input => {
      try {
        if (input.message.statusCode) {
          // already transformed event
          return getSuccessRespEvents(
            input.message,
            [input.metadata],
            input.destination
          );
        }
        // if not transformed
        return getSuccessRespEvents(
          process(input),
          [input.metadata],
          input.destination
        );
      } catch (error) {
        return getErrorRespEvents(
          [input.metadata],
          error.response ? error.response.status : error.code || 400,
          error.message || "Error occurred while processing payload."
        );
      }
    })
  );
};

module.exports = { process, processRouterDest };
