const {
  defaultRequestConfig,
  simpleProcessRouterDest,
  defaultPostRequestConfig,
} = require('../../util');

const { offlineConversionResponseBuilder, prepareUrls } = require('./utils');

const { EventType } = require('../../../constants');
const { InstrumentationError, TransformationError } = require('../../util/errorTypes');

const responseBuilder = (endpoint) => {
  if (endpoint) {
    const response = defaultRequestConfig();
    response.endpoint = endpoint;
    response.method = defaultPostRequestConfig.requestMethod;
    return response;
  }
  // fail-safety for developer error
  throw new TransformationError('Payload could not be constructed');
};

const trackResponseBuilder = (message, destination) => {
  if (!message.event) {
    throw new InstrumentationError('Parameter event is required.');
  }

  const offlineConversionsPayloads = offlineConversionResponseBuilder(message, destination);

  const finalResponseUrls = [];
  offlineConversionsPayloads.forEach((item) => {
    const { data, eventSetIds, payload } = item;
    finalResponseUrls.push(...prepareUrls(destination, data, eventSetIds, payload));
  });

  const eventsToSend = [];
  finalResponseUrls.forEach((url) => {
    const response = responseBuilder(url);
    eventsToSend.push(response);
  });
  return eventsToSend;
};

const processEvent = (message, destination) => {
  // Validating if message type is even given or not
  if (!message.type) {
    throw new InstrumentationError('Message Type is not present. Aborting message.');
  }
  const messageType = message.type.toLowerCase();
  if (messageType === EventType.TRACK) {
    return trackResponseBuilder(message, destination);
  }

  throw new InstrumentationError(`Message type ${messageType} not supported.`);
};

const process = (event) => {
  const res = processEvent(event.message, event.destination);
  return res;
};

const processRouterDest = async (inputs, reqMetadata) => {
  const respList = await simpleProcessRouterDest(inputs, process, reqMetadata);
  return respList;
};

module.exports = { process, processRouterDest };
