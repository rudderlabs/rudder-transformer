const { BASE_URL } = require("./config");
const {
  defaultRequestConfig,
  CustomError,
  simpleProcessRouterDest
} = require("../../util");

const { getParams } = require("./utils");

const responseBuilder = (message, { Config }) => {
  const { advertiserId, eventsToTrack } = Config;

  const eventsList = [];

  eventsToTrack.forEach(object => {
    eventsList.push(object.eventName);
  });

  let params;
  // if the event is present in eventsList
  if (eventsList.includes(message.event)) {
    params = getParams(message, advertiserId);
  } else {
    throw new CustomError(
      "Event is not present in 'Events to Track' list. Aborting message.",
      400
    );
  }
  const response = defaultRequestConfig();
  response.params = params;
  response.endpoint = BASE_URL;

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
  const respList = await simpleProcessRouterDest(inputs, "AWIN", process);
  return respList;
};

module.exports = { process, processRouterDest };
