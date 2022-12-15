const { BASE_URL, ConfigCategory, mappingConfig } = require("./config");
const {
  defaultRequestConfig,
  constructPayload,
  simpleProcessRouterDest
} = require("../../util");

const { getParams } = require("./utils");
const {
  InstrumentationError,
  ConfigurationError
} = require("../../util/errorTypes");

const responseBuilder = (message, { Config }) => {
  const { advertiserId, eventsToTrack } = Config;

  const payload = constructPayload(
    message,
    mappingConfig[ConfigCategory.TRACK.name]
  );

  let params = {};
  if (Array.isArray(eventsToTrack)) {
    const eventsList = [];
    eventsToTrack.forEach(object => {
      eventsList.push(object.eventName);
    });

    // if the event is present in eventsList
    if (eventsList.includes(message.event)) {
      params = getParams(payload.params, advertiserId);
    } else {
      throw new InstrumentationError(
        "Event is not present in 'Events to Track' list. Aborting message.",
        400
      );
    }
  }
  const response = defaultRequestConfig();
  response.params = params;
  response.endpoint = BASE_URL;

  return response;
};

const processEvent = (message, destination) => {
  if (!destination.Config.advertiserId) {
    throw new ConfigurationError(
      "Advertiser Id is not present. Aborting message.",
      400
    );
  }
  if (!message.type) {
    throw new InstrumentationError(
      "Message Type is not present. Aborting message.",
      400
    );
  }
  const messageType = message.type.toLowerCase();

  let response;
  if (messageType === "track") {
    response = responseBuilder(message, destination);
  } else {
    throw new InstrumentationError("Message type not supported", 400);
  }

  return response;
};

const process = event => {
  return processEvent(event.message, event.destination);
};

const processRouterDest = async (inputs, reqMetadata) => {
  const respList = await simpleProcessRouterDest(inputs, process, reqMetadata);
  return respList;
};

module.exports = { process, processRouterDest };
