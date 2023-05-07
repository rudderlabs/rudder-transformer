const { EventType } = require('../../../constants');

const {
  constructPayload,
  defaultRequestConfig,
  removeUndefinedAndNullValues,
  flattenJson,
  defaultPostRequestConfig,
  simpleProcessRouterDest,
} = require('../../util');
const { JSON_MIME_TYPE } = require('../../util/constant');
const { InstrumentationError } = require('../../util/errorTypes');

const { ConfigCategories, mappingConfig, BASE_URL } = require('./config');

// build final response
function buildResponse(payload, factorsAIApiKey) {
  const response = defaultRequestConfig();
  const apiKey = Buffer.from(`${factorsAIApiKey}:`).toString('base64');
  response.endpoint = BASE_URL;
  response.headers = {
    'Content-Type': JSON_MIME_TYPE,
    Authorization: `Basic ${apiKey}`,
  };
  response.method = defaultPostRequestConfig.requestMethod;
  response.body.JSON = removeUndefinedAndNullValues(payload);
  return response;
}

// process identify call
function processIdentify(message, factorsAIApiKey) {
  const requestJson = constructPayload(message, mappingConfig[ConfigCategories.IDENTIFY.name]);
  return buildResponse(requestJson, factorsAIApiKey);
}

// process track call
function processTrack(message, factorsAIApiKey) {
  const requestJson = constructPayload(message, mappingConfig[ConfigCategories.TRACK.name]);
  // flatten json as factorsAi do not support nested properties
  requestJson.properties = flattenJson(requestJson.properties);
  return buildResponse(requestJson, factorsAIApiKey);
}

function process(event) {
  const { message, destination } = event;
  const { factorsAIApiKey } = destination.Config;

  if (!message.type) {
    throw new InstrumentationError('Message Type is not present. Aborting message.');
  }

  const messageType = message.type.toLowerCase();

  switch (messageType) {
    case EventType.IDENTIFY:
      return processIdentify(message, factorsAIApiKey);
    case EventType.TRACK:
      return processTrack(message, factorsAIApiKey);
    default:
      throw new InstrumentationError(`Message type ${messageType} is not supported`);
  }
}

const processRouterDest = async (inputs, reqMetadata) => {
  const respList = await simpleProcessRouterDest(inputs, process, reqMetadata);
  return respList;
};

module.exports = { process, processRouterDest };
