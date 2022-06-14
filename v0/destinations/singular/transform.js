const { BASE_URL, sessionEvents } = require("./config");
const {
  defaultRequestConfig,
  defaultGetRequestConfig,
  removeUndefinedAndNullValues,
  getSuccessRespEvents,
  getErrorRespEvents,
  CustomError
} = require("../../util");

const {
  platformWisePayloadGenerator,
  generateRevenuePayloadArray,
  isSessionEvent
} = require("./util");

const responseBuilderSimple = (message, { Config }) => {
  let endpoint;
  let eventAttributes;
  let payload;
  let singularEventParams;
  const eventName = message.event;

  if (!eventName) {
    throw new CustomError(
      "[Singular]::event name is not present for the event",
      400
    );
  }

  if (isSessionEvent(Config, eventName)) {
    // Use the session notification endpoint to report a session to Singular
    // https://support.singular.net/hc/en-us/articles/360048588672-Server-to-Server-S2S-API-Endpoint-Reference#Session_Notification_Endpoint
    singularEventParams = platformWisePayloadGenerator(message, true);
    endpoint = `${BASE_URL}/launch`;
    eventAttributes = singularEventParams.eventAttributes;
    payload = singularEventParams.payload;
  } else {
    // Use this endpoint to report any event occurring in your application other than the session
    // https://support.singular.net/hc/en-us/articles/360048588672-Server-to-Server-S2S-API-Endpoint-Reference#Event_Notification_Endpoint
    endpoint = `${BASE_URL}/evt`;
    singularEventParams = platformWisePayloadGenerator(message, false);
    eventAttributes = singularEventParams.eventAttributes;
    payload = singularEventParams.payload;
    const { products } = message.properties;
    // If we have an event where we have an array of Products, example Order Completed
    // We are returning an array of revenue events
    if (products && Array.isArray(products)) {
      return generateRevenuePayloadArray(
        products,
        payload,
        Config,
        eventAttributes
      );
    }
  }

  const response = { ...defaultRequestConfig(), endpoint };
  response.params = { ...payload, a: Config.apiKey };
  if (eventAttributes) {
    response.params = { ...response.params, e: eventAttributes };
  }
  response.method = defaultGetRequestConfig.requestMethod;
  return response;
};

const processEvent = (message, destination) => {
  if (!message.type) {
    throw new CustomError(
      "Message Type is not present. Aborting message.",
      400
    );
  }
  const messageType = message.type.toLowerCase();

  if (messageType === "track")
    return responseBuilderSimple(message, destination);

  throw new CustomError("[Singular]: Message type not supported", 400);
};

const process = event => {
  return processEvent(event.message, event.destination);
};

const processRouterDest = async inputs => {
  if (!Array.isArray(inputs) || inputs.length <= 0) {
    const respEvents = getErrorRespEvents(null, 400, "Invalid event array");
    return [respEvents];
  }

  const respList = await Promise.all(
    inputs.map(async input => {
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
          await process(input),
          [input.metadata],
          input.destination
        );
      } catch (error) {
        return getErrorRespEvents(
          [input.metadata],
          error.response
            ? error.response.status
            : error.code
            ? error.code
            : 400,
          error.message || "Error occurred while processing payload."
        );
      }
    })
  );
  return respList;
};
module.exports = { process, processRouterDest };
