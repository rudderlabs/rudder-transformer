const {
  BASE_URL,
  DESTINATION
} = require("./config");
const {
  defaultRequestConfig,
  CustomError,
  getSuccessRespEvents,
  handleRtTfSingleEventError,
  checkInvalidRtTfEvents
} = require("../../util");

const { getEndpoint } = require("./utils");

const responseBuilder = (message, { Config }) => {
  const { advertiserId, eventsToTrack } = Config;
  let endpoint = BASE_URL.concat("&merchant=", advertiserId);
  // if the event is present in eventsToTrack List
  if (eventsToTrack.includes(message.event)) {
    endpoint = getEndpoint(message, endpoint);
  } else {
    throw new CustomError(
      "Event is not present in 'Events to Track' list. Aborting message.",
      400
    );
  }
  const response = defaultRequestConfig();
  response.endpoint = endpoint;

  return response;
};

const processEvent = (message, destination) => {
  if (!destination.Config.advertiserId) {
    throw new CustomError(
      "Advertiser Id is not present. Aborting message.",
      400
    );
  }
  if (!message.type) {
    throw new CustomError(
      "Message Type is not present. Aborting message.",
      400
    );
  }
  const messageType = message.type.toLowerCase();

  let response;
  if (messageType === "track") {
    response = responseBuilder(message, destination);
  } else {
    throw new CustomError("Message type not supported", 400);
  }

  return response;
};

const process = event => {
  return processEvent(event.message, event.destination);
};

const processRouterDest = async inputs => {
  const errorRespEvents = checkInvalidRtTfEvents(inputs, DESTINATION);
  if (errorRespEvents.length > 0) {
    return errorRespEvents;
  }

  const respList = await Promise.all(
    inputs.map(async input => {
      try {
        const message = input.message.statusCode
          ? input.message
          : process(input);
        return getSuccessRespEvents(
          message,
          [input.metadata],
          input.destination
        );
      } catch (error) {
        return handleRtTfSingleEventError(input, error, DESTINATION);
      }
    })
  );
  return respList;
};

module.exports = { process, processRouterDest };
