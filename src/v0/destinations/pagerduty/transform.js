const {
  ConfigurationError,
  TransformationError,
  InstrumentationError,
} = require('@rudderstack/integrations-lib');
const { EventType } = require('../../../constants');
const {
  defaultRequestConfig,
  simpleProcessRouterDest,
  defaultPostRequestConfig,
  removeUndefinedAndNullValues,
} = require('../../util');
const { JSON_MIME_TYPE } = require('../../util/constant');
const { trackEventPayloadBuilder } = require('./util');

const responseBuilder = (payload, endpoint) => {
  if (payload) {
    const response = defaultRequestConfig();
    response.endpoint = endpoint;
    response.headers = {
      'Content-Type': JSON_MIME_TYPE,
    };
    response.method = defaultPostRequestConfig.requestMethod;
    response.body.JSON = removeUndefinedAndNullValues(payload);
    return response;
  }
  // fail-safety for developer error
  throw new TransformationError('Something went wrong while constructing the payload');
};

const trackResponseBuilder = (message, Config) => {
  if (!message.event) {
    throw new InstrumentationError('Event name is required');
  }
  const builder = trackEventPayloadBuilder(message, Config);
  const { payload, endpoint } = builder;
  return responseBuilder(payload, endpoint);
};

const process = (event) => {
  const { message, destination } = event;
  const { Config } = destination;

  if (!Config.routingKey) {
    throw new ConfigurationError('Routing Key Is Required');
  }

  if (!message.type) {
    throw new InstrumentationError('Event type is required');
  }
  const messageType = message.type.toLowerCase();

  if (messageType === EventType.TRACK) {
    return trackResponseBuilder(message, Config);
  }

  throw new InstrumentationError(`Event type ${messageType} is not supported`);
};

const processRouterDest = async (inputs, reqMetadata) => {
  const respList = await simpleProcessRouterDest(inputs, process, reqMetadata);
  return respList;
};

module.exports = { process, processRouterDest };
