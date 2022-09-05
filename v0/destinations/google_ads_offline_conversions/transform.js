const { EventType } = require("../../../constants");
const {
  CustomError,
  getHashFromArrayWithDuplicate,
  constructPayload,
  removeHyphens,
  getValueFromMessage,
  defaultRequestConfig,
  getErrorRespEvents,
  getSuccessRespEvents
} = require("../../util");
const {
  trackClickConversionsMapping,
  CLICK_CONVERSION,
  trackCallConversionsMapping
} = require("./config");
const { validateDestinationConfig, getAccessToken } = require("./utils");

const getConversions = (message, metadata, { Config }, conversionType) => {
  let payload;
  if (conversionType === "click") {
    payload = constructPayload(message, trackClickConversionsMapping);
  } else {
    payload = constructPayload(message, trackCallConversionsMapping);
  }

  payload.partialFailure = true;

  const response = defaultRequestConfig();
  const filteredCustomerId = removeHyphens(Config.customerId);
  response.endpoint = CLICK_CONVERSION.replace(
    ":customerId",
    filteredCustomerId
  );
  response.body.JSON = payload;
  response.headers = {
    Authorization: `Bearer ${getAccessToken(metadata)}`,
    "Content-Type": "application/json",
    "developer-token": getValueFromMessage(metadata, "secret.developer_token")
  };

  return response;
};

const trackResponseBuilder = (message, metadata, destination) => {
  let { eventsToStandard } = destination.Config;
  let { event } = message;
  if (!event) {
    throw new CustomError(
      "[Google Ads Offline Conversions]:: Event name is not present",
      400
    );
  }

  event = event.toLowerCase().trim();

  eventsToStandard = getHashFromArrayWithDuplicate(eventsToStandard);

  const responseList = [];
  if (!eventsToStandard[event]) {
    throw new CustomError(`Event name '${event}' is not valid`, 400);
  }

  Object.keys(eventsToStandard).forEach(key => {
    if (key === event) {
      eventsToStandard[event].forEach(conversionType => {
        responseList.push(
          getConversions(message, metadata, destination, conversionType)
        );
      });
    }
  });
  return responseList;
};

const process = async event => {
  const { message, metadata, destination } = event;

  if (!message.type) {
    throw new CustomError(
      "[Google Ads Offline Conversions]:: Message type is not present. Aborting message.",
      400
    );
  }

  validateDestinationConfig(destination);

  const messageType = message.type.toLowerCase();
  let response;
  switch (messageType) {
    case EventType.TRACK:
      response = trackResponseBuilder(message, metadata, destination);

      break;
    default:
      throw new CustomError(
        `[Google Ads Offline Conversions]:: Message type ${messageType} not supported`,
        400
      );
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
            : error.status || 400,
          error.message || "Error occurred while processing payload."
        );
      }
    })
  );

  return respList;
};

module.exports = { process, processRouterDest };
