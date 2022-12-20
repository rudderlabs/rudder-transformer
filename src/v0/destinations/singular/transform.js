const { BASE_URL } = require("./config");
const {
  defaultRequestConfig,
  defaultGetRequestConfig,
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
  const eventName = message.event;

  if (!eventName) {
    throw new CustomError(
      "[Singular]::event name is not present for the event",
      400
    );
  }

  const sessionEvent = isSessionEvent(Config, eventName);
  const { eventAttributes, payload } = platformWisePayloadGenerator(
    message,
    sessionEvent
  );
  const endpoint = sessionEvent ? `${BASE_URL}/launch` : `${BASE_URL}/evt`;

  if (!sessionEvent) {
    const { products } = message.properties;
    // If we have an event where we have an array of Products, example Order Completed
    // We will convert the event to revenue events
    if (products && Array.isArray(products)) {
      return generateRevenuePayloadArray(
        products,
        payload,
        Config,
        eventAttributes
      );
    }
  }

  const response = {
    ...defaultRequestConfig(),
    endpoint,
    params: { ...payload, a: Config.apiKey },
    method: defaultGetRequestConfig.requestMethod
  };
  if (eventAttributes) {
    response.params = { ...response.params, e: eventAttributes };
  }
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

  if (messageType === "track") {
    return responseBuilderSimple(message, destination);
  }

  throw new CustomError("[Singular]: Message type not supported", 400);
};

const process = event => {
  return processEvent(event.message, event.destination);
};

const processRouterDest = inputs => {
  if (!Array.isArray(inputs) || inputs.length <= 0) {
    const respEvents = getErrorRespEvents(null, 400, "Invalid event array");
    return [respEvents];
  }

  const respList = Promise.all(
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
          process(input),
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
