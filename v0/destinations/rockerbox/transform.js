const get = require("get-value");

const set = require("set-value");
const {
  defaultRequestConfig,
  CustomError,
  removeUndefinedAndNullValues,
  constructPayload,
  getSuccessRespEvents,
  getErrorRespEvents,
  getHashFromArray
} = require("../../util");
const { EventType } = require("../../../constants");
const { CONFIG_CATEGORIES, MAPPING_CONFIG } = require("./config");

const responseBuilderSimple = (message, category, destination) => {
  const payload = constructPayload(message, MAPPING_CONFIG[category.name]);
  // conversion_source is explicitly set to RudderStack
  payload.conversion_source = "RudderStack";

  const { advertiserId, eventsMap } = destination.Config;
  const eventsHashMap = getHashFromArray(eventsMap);

  if (!eventsHashMap[message.event.toLowerCase()]) {
    throw new CustomError(
      "The event is not associated to a RockerBox event. Aborting!",
      400
    );
  } else {
    set((payload.action = eventsHashMap[message.event.toLowerCase()]));
  }

  const response = defaultRequestConfig();
  response.endpoint = category.endpoint;
  response.params.advertiser = advertiserId;
  response.body.JSON = removeUndefinedAndNullValues(payload);
  response.method = category.method;

  return response;
};

const trackResponseBuilder = (message, category, destination) => {
  const respList = [];
  const response = responseBuilderSimple(message, category, destination);
  respList.push(response);

  return respList;
};

const process = event => {
  const { message, destination } = event;
  if (!message.type) {
    throw new CustomError(
      "Message Type is not present. Aborting message.",
      400
    );
  }

  const advertiserId = get(destination, "Config.advertiserId");
  if (!advertiserId) {
    throw new CustomError("Advertiser Id is required.", 400);
  }

  let response;
  const messageType = message.type.toLowerCase();
  switch (messageType) {
    case EventType.TRACK:
      response = trackResponseBuilder(
        message,
        CONFIG_CATEGORIES.TRACK,
        destination
      );
      break;
    default:
      throw new CustomError(`Message type ${messageType} not supported`, 400);
  }
  return response;
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
          // eslint-disable-next-line no-nested-ternary
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
