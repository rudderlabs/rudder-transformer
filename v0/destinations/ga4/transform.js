const get = require("get-value");
const { EventType } = require("../../../constants");
const {
  CustomError,
  defaultPostRequestConfig,
  constructPayload,
  defaultRequestConfig
} = require("../../util");
const {
  ENDPOINT,
  trackCommonConfig,
  eventNameMapping,
  mappingConfig,
  ConfigCategory
} = require("./config");
const {
  msUnixTimestamp,
  isReservedEventName,
  isReservedCustomEventNameWeb,
  isReservedCustomPrefixNameWeb
} = require("./utils");

const trackResponseBuilder = async (message, { Config }) => {
  let event = get(message, "event");
  if (!event) {
    throw new CustomError("Event name is required", 400);
  }

  // trim, and replace spaces with "_"
  event = event.trim().replace(/\s+/g, "_");

  // reserved event names are not allowed
  if (isReservedEventName(event)) {
    throw new CustomError(
      "[Google Analytics 4] track:: Reserved event names are not allowd",
      400
    );
  }

  // get common top level rawPayload
  let rawPayload = constructPayload(message, trackCommonConfig);
  if (rawPayload.timestamp_micros) {
    rawPayload.timestamp_micros = msUnixTimestamp(rawPayload.timestamp_micros);
  }

  const payload = {};
  if (eventNameMapping[event.toLowerCase()]) {
    // GA4 standard events
    // get event specific parameters
    switch (event.toLowerCase()) {
      case "products_searched":
        payload.name = eventNameMapping[event.toLowerCase()];
        payload.params = constructPayload(
          message,
          mappingConfig[ConfigCategory.PRODUCTS_SEARCHED.name]
        );
        break;
      default:
        break;
    }
  } else {
    // custom events category
    // Event names are case sensitive.
    if (isReservedCustomEventNameWeb(event)) {
      throw new CustomError(
        "[Google Analytics 4] track:: Reserved event names are not allowd",
        400
      );
    }

    if (isReservedCustomPrefixNameWeb(event)) {
      throw new CustomError(
        "[Google Analytics 4] track:: Reserved prefix names are not allowd",
        400
      );
    }

    payload.name = event;
    payload.params = get(message, "properties");
  }

  rawPayload = { ...rawPayload, events: [payload] };

  // build response
  const response = defaultRequestConfig();
  response.method = defaultPostRequestConfig.requestMethod;
  response.endpoint = ENDPOINT;
  response.headers = {
    HOST: "www.google-analytics.com",
    "Content-Type": "application/json"
  };
  response.params = {
    api_secret: Config.apiSecret,
    measurement_id: Config.measurementId
  };
  response.body.JSON = rawPayload;
  return response;
};

const process = async event => {
  const { message, destination } = event;

  if (!destination.Config.apiSecret) {
    throw new CustomError("API Secret not found. Aborting ", 400);
  }
  if (!destination.Config.measurementId) {
    throw new CustomError("Measurement ID not found. Aborting", 400);
  }

  if (!message.type) {
    throw new CustomError(
      "Message Type is not present. Aborting message.",
      400
    );
  }

  const messageType = message.type.toLowerCase();
  let response;
  switch (messageType) {
    case EventType.TRACK:
      response = await trackResponseBuilder(message, destination);
      break;
    default:
      throw new CustomError(`Message type ${messageType} not supported`, 400);
  }
  return response;
};

module.exports = { process };
