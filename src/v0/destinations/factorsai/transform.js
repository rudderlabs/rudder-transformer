const { InstrumentationError } = require('@rudderstack/integrations-lib');
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

const { ConfigCategories, mappingConfig, BASE_URL } = require('./config');

function populateIpDetails(requestJson, message) {
  const payload = requestJson;
  if (message.context || message.request_ip) {
    payload.context = { ...(payload.context || {}), ip: message.context?.ip || message.request_ip };
  }
  return payload;
}

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
  let requestJson = constructPayload(message, mappingConfig[ConfigCategories.IDENTIFY.name]);
  requestJson = populateIpDetails(requestJson, message);
  return buildResponse(requestJson, factorsAIApiKey);
}

// process track call
function processTrack(message, factorsAIApiKey) {
  let requestJson = constructPayload(message, mappingConfig[ConfigCategories.TRACK.name]);
  requestJson = populateIpDetails(requestJson, message);
  // flatten json as factorsAi do not support nested properties
  requestJson.properties = flattenJson(requestJson.properties);
  return buildResponse(requestJson, factorsAIApiKey);
}

// process Page Call
function processPageAndGroup(message, factorsAIApiKey, category) {
  let requestJson = constructPayload(message, mappingConfig[category]);
  requestJson = populateIpDetails(requestJson, message);
  requestJson.type = message.type;
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
    case EventType.PAGE:
      return processPageAndGroup(message, factorsAIApiKey, ConfigCategories.PAGE.name);
    case EventType.GROUP:
      return processPageAndGroup(message, factorsAIApiKey, ConfigCategories.GROUP.name);
    default:
      throw new InstrumentationError(`Message type ${messageType} is not supported`);
  }
}

const processRouterDest = async (inputs, reqMetadata) => {
  const respList = await simpleProcessRouterDest(inputs, process, reqMetadata);
  return respList;
};

module.exports = { process, processRouterDest };
