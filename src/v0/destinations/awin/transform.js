const { InstrumentationError, ConfigurationError } = require('@rudderstack/integrations-lib');
const { BASE_URL, ConfigCategory, mappingConfig } = require('./config');
const { defaultRequestConfig, constructPayload, simpleProcessRouterDest } = require('../../util');

const { getParams, trackProduct, populateCustomTransactionProperties } = require('./utils');
const { FilteredEventsError } = require('../../util/errorTypes');

const responseBuilder = (message, { Config }) => {
  const { advertiserId, eventsToTrack, customFieldMap } = Config;
  const { event, properties } = message;
  let finalParams = {};

  const payload = constructPayload(message, mappingConfig[ConfigCategory.TRACK.name]);

  let params = {};
  if (Array.isArray(eventsToTrack)) {
    const eventsList = [];
    eventsToTrack.forEach((object) => {
      eventsList.push(object.eventName);
    });

    // if the event is present in eventsList
    if (eventsList.includes(event)) {
      params = getParams(payload.params, advertiserId);
      const productTrackObject = trackProduct(properties, advertiserId, params.parts);
      const customTransactionProperties = populateCustomTransactionProperties(
        properties,
        customFieldMap,
      );

      finalParams = {
        ...params,
        ...productTrackObject,
        ...customTransactionProperties,
      };
    } else {
      throw new FilteredEventsError(
        "Event is not present in 'Events to Track' list. Dropping the event.",
        298,
      );
    }
  }
  const response = defaultRequestConfig();
  response.params = finalParams;
  response.endpoint = BASE_URL;

  return response;
};

const processEvent = (message, destination) => {
  if (!destination.Config.advertiserId) {
    throw new ConfigurationError('Advertiser Id is not present. Aborting message.', 400);
  }
  if (!message.type) {
    throw new InstrumentationError('Message Type is not present. Aborting message.', 400);
  }
  const messageType = message.type.toLowerCase();

  let response;
  if (messageType === 'track') {
    response = responseBuilder(message, destination);
  } else {
    throw new InstrumentationError('Message type not supported', 400);
  }

  return response;
};

const process = (event) => processEvent(event.message, event.destination);

const processRouterDest = async (inputs, reqMetadata) => {
  const respList = await simpleProcessRouterDest(inputs, process, reqMetadata);
  return respList;
};

module.exports = { process, processRouterDest };
