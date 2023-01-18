const get = require('get-value');
const {
  defaultRequestConfig,
  removeUndefinedAndNullValues,
  constructPayload,
  simpleProcessRouterDest,
  getHashFromArray,
} = require('../../util');
const { EventType } = require('../../../constants');
const { CONFIG_CATEGORIES, MAPPING_CONFIG } = require('./config');
const { ConfigurationError, InstrumentationError } = require('../../util/errorTypes');

const responseBuilderSimple = (message, category, destination) => {
  const payload = constructPayload(message, MAPPING_CONFIG[category.name]);
  // conversion_source is explicitly set to RudderStack
  payload.conversion_source = 'RudderStack';

  const { advertiserId, eventsMap } = destination.Config;
  // we will map the events to their rockerbox counterparts from UI
  const eventsHashMap = getHashFromArray(eventsMap);

  // Reject other unmapped events
  if (!eventsHashMap[message.event.toLowerCase()]) {
    throw new ConfigurationError('The event is not associated to a RockerBox event. Aborting!');
  } else {
    payload.action = eventsHashMap[message.event.toLowerCase()];
  }
  const response = defaultRequestConfig();
  response.endpoint = category.endpoint;
  // the endpoint has advertiser = ADVERTISER_ID in the query params
  response.params.advertiser = advertiserId;
  response.body.JSON = removeUndefinedAndNullValues(payload);
  response.method = category.method;

  return response;
};

const process = (event) => {
  const { message, destination } = event;
  if (!message.type) {
    throw new InstrumentationError('Event type is required');
  }

  const advertiserId = get(destination, 'Config.advertiserId');
  if (!advertiserId) {
    throw new ConfigurationError('Advertiser Id is required.');
  }

  let response;
  const messageType = message.type.toLowerCase();
  switch (messageType) {
    case EventType.TRACK:
      response = responseBuilderSimple(message, CONFIG_CATEGORIES.TRACK, destination);
      break;
    default:
      throw new InstrumentationError(`Message type ${messageType} is not supported`);
  }
  return response;
};

const processRouterDest = async (inputs, reqMetadata) => {
  const respList = await simpleProcessRouterDest(inputs, process, reqMetadata);
  return respList;
};

module.exports = { process, processRouterDest };
