/* eslint-disable no-param-reassign */
const { set, get } = require('lodash');
const {
  defaultRequestConfig,
  constructPayload,
  removeUndefinedAndNullValues,
  getIntegrationsObj,
  defaultGetRequestConfig,
  simpleProcessRouterDest,
} = require('../../util');

const { EventType } = require('../../../constants');
const { BASE_URL, mappingConfig, ConfigCategories } = require('./config');
const { refinePayload, getEvent } = require('./utils');
const { TransformationError, InstrumentationError } = require('../../util/errorTypes');

const responseBuilder = (payload, endpoint, method, projectName) => {
  if (!payload) {
    throw new TransformationError('Something went wrong while constructing the payload');
  }
  set(payload, 'timestamp', get(payload, 'timestamp').toString());
  set(payload, 'Project', projectName);
  const response = defaultRequestConfig();
  response.params = removeUndefinedAndNullValues(payload);
  response.endpoint = endpoint;
  response.method = method;
  return response;
};

/**
 * For Woopra we can pass traits as well inside track and page (track for woopra)
 * which generates too common fields so for that we have kept this function
 * which we genrate the common payload for the different calls
 * @param {*} message
 * @param {*} projectName
 * @param {*} genericFields
 * @returns method, payload, extractedProjectNamw which are common to all of the calls
 */
const commonPayloadGenerator = (message, projectName, genericFields) => {
  let payload = constructPayload(message, mappingConfig[ConfigCategories.IDENTIFY.name]);
  const refinedPayload = refinePayload(message, genericFields);
  payload = { ...payload, ...refinedPayload };
  const extractedProjectName = getIntegrationsObj(message, 'woopra')?.projectName || projectName;
  const method = defaultGetRequestConfig.requestMethod;
  const response = { method, payload, extractedProjectName };
  return response;
};
const identifyResponseBuilder = (message, projectName) => {
  const endpoint = `${BASE_URL}/identify`;
  const { method, payload, extractedProjectName } = commonPayloadGenerator(
    message,
    projectName,
    ConfigCategories.IDENTIFY.genericFields,
  );
  return responseBuilder(payload, endpoint, method, extractedProjectName);
};
const trackResponseBuilder = (message, projectName) => {
  const endpoint = `${BASE_URL}/ce`;
  if (!message.event) {
    throw new InstrumentationError('Event Name can not be empty');
  }
  const { method, payload, extractedProjectName } = commonPayloadGenerator(
    message,
    projectName,
    ConfigCategories.TRACK.genericFields,
  );
  payload.event = message.event;
  return responseBuilder(payload, endpoint, method, extractedProjectName);
};
const pageResponseBuilder = (message, projectName) => {
  const endpoint = `${BASE_URL}/ce`;
  const { method, payload, extractedProjectName } = commonPayloadGenerator(
    message,
    projectName,
    ConfigCategories.PAGE.genericFields,
  );
  const commonPayload = payload;
  const pagePayload = constructPayload(message, mappingConfig[ConfigCategories.PAGE.name]);
  const mergedPayload = { ...commonPayload, ...pagePayload };

  mergedPayload.event = getEvent(message);
  return responseBuilder(mergedPayload, endpoint, method, extractedProjectName);
};
const process = (event) => {
  const { message, destination } = event;
  const { projectName } = destination.Config;
  if (!projectName) {
    throw new InstrumentationError('Project Name field can not be empty');
  }
  if (!message.type) {
    throw new InstrumentationError('Event type is required');
  }
  const messageType = message.type.toLowerCase();
  let response;
  switch (messageType) {
    case EventType.IDENTIFY:
      response = identifyResponseBuilder(message, projectName);
      break;
    case EventType.TRACK:
      response = trackResponseBuilder(message, projectName);
      break;
    case EventType.PAGE:
      response = pageResponseBuilder(message, projectName);
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
