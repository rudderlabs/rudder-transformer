const { BASE_URL } = require("./config");
const {
  defaultRequestConfig,
  defaultGetRequestConfig,
  simpleProcessRouterDest
} = require("../../util");

const {
  platformWisePayloadGenerator,
  generateRevenuePayloadArray,
  isSessionEvent
} = require("./util");
const { InstrumentationError } = require("../../util/errorTypes");

const responseBuilderSimple = (message, { Config }) => {
  const eventName = message.event;

  if (!eventName) {
    throw new InstrumentationError("Event name is not present for the event");
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
    throw new InstrumentationError("Event type is required");
  }
  const messageType = message.type.toLowerCase();

  if (messageType === "track") {
    return responseBuilderSimple(message, destination);
  }

  throw new InstrumentationError(`Event type ${messageType} is not supported`);
};

const process = event => {
  return processEvent(event.message, event.destination);
};

const processRouterDest = async (inputs, reqMetadata) => {
  const respList = await simpleProcessRouterDest(inputs, process, reqMetadata);
  return respList;
};

module.exports = { process, processRouterDest };
