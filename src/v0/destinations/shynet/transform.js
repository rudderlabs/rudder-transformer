/* eslint-disable no-underscore-dangle */
const { EventType } = require('../../../constants');

const {
  constructPayload,
  defaultRequestConfig,
  removeUndefinedAndNullValues,
  simpleProcessRouterDest,
  generateUUID,
} = require('../../util');
const { InstrumentationError } = require('../../util/errorTypes');

const { ConfigCategory, mappingConfig } = require('./config');

// build final response
function buildResponse(payload, endpoint) {
  const response = defaultRequestConfig();
  response.endpoint = endpoint;
  response.body.JSON = removeUndefinedAndNullValues(payload);
  response.headers = {
    'Content-Type': 'application/json',
  };
  return response;
}

// process page call
function processPage(message, shynetServiceUrl) {
  const requestJson = constructPayload(message, mappingConfig[ConfigCategory.PAGE.name]);

  // generating UUID
  requestJson.idempotency = message.messageId || generateUUID();
  return buildResponse(requestJson, shynetServiceUrl);
}

function process(event) {
  const { message, destination } = event;
  const { shynetServiceUrl } = destination.Config;

  if (!message.type) {
    throw new InstrumentationError('Event type is required');
  }

  const messageType = message.type.toLowerCase();

  switch (messageType) {
    case EventType.PAGE:
      return processPage(message, shynetServiceUrl);
    default:
      throw new InstrumentationError(`Event type "${messageType}" is not supported`);
  }
}

const processRouterDest = async (inputs, reqMetadata) => {
  const respList = await simpleProcessRouterDest(inputs, process, reqMetadata);
  return respList;
};

module.exports = { process, processRouterDest };
