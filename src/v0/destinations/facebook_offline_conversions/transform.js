const { InstrumentationError, TransformationError } = require('@rudderstack/integrations-lib');
const {
  defaultRequestConfig,
  simpleProcessRouterDest,
  defaultPostRequestConfig,
} = require('../../util');

const { offlineConversionResponseBuilder, prepareRequestDetails } = require('./utils');

const { EventType } = require('../../../constants');

const responseBuilder = (requestDetails) => {
  if (requestDetails) {
    const response = defaultRequestConfig();
    response.endpoint = requestDetails.endpoint;
    response.params = requestDetails.params;
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

  const finalRequestDetails = [];
  offlineConversionsPayloads.forEach((item) => {
    const { data, eventSetIds, payload } = item;
    finalRequestDetails.push(...prepareRequestDetails(destination, data, eventSetIds, payload));
  });

  const eventsToSend = [];
  finalRequestDetails.forEach((requestDetails) => {
    const response = responseBuilder(requestDetails);
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
