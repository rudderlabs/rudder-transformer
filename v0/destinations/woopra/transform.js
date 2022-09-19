/* eslint-disable no-param-reassign */
const { set, get } = require("lodash");
const {
  defaultRequestConfig,
  CustomError,
  constructPayload,
  removeUndefinedAndNullValues,
  getErrorRespEvents,
  getIntegrationsObj,
  getSuccessRespEvents,
  defaultGetRequestConfig
} = require("../../util");

const { EventType } = require("../../../constants");
const { BASE_URL, mappingConfig, ConfigCategories } = require("./config");
const { refinePayload, getEvent } = require("./utils");

const responseBuilder = (payload, endpoint, method, projectName) => {
  if (!payload) {
    throw new CustomError("[ WOOPRA ]:: Parameters could not be found", 400);
  }
  set(payload, "timestamp", get(payload, "timestamp").toString());
  set(payload, "Project", projectName);
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
  let payload = constructPayload(
    message,
    mappingConfig[ConfigCategories.IDENTIFY.name]
  );
  const refinedPayload = refinePayload(message, genericFields);
  payload = { ...payload, ...refinedPayload };
  const extractedProjectName =
    getIntegrationsObj(message, "woopra")?.projectName || projectName;
  const method = defaultGetRequestConfig.requestMethod;
  const response = { method, payload, extractedProjectName };
  return response;
};
const identifyResponseBuilder = (message, projectName) => {
  const endpoint = `${BASE_URL}/identify`;
  const { method, payload, extractedProjectName } = commonPayloadGenerator(
    message,
    projectName,
    ConfigCategories.IDENTIFY.genericFields
  );
  return responseBuilder(payload, endpoint, method, extractedProjectName);
};
const trackResponseBuilder = (message, projectName) => {
  const endpoint = `${BASE_URL}/ce`;
  if (!message.event) {
    throw new CustomError("[ WOOPRA ]:: Event Name can not be empty.", 400);
  }
  const { method, payload, extractedProjectName } = commonPayloadGenerator(
    message,
    projectName,
    ConfigCategories.TRACK.genericFields
  );
  payload.event = message.event;
  return responseBuilder(payload, endpoint, method, extractedProjectName);
};
const pageResponseBuilder = (message, projectName) => {
  const endpoint = `${BASE_URL}/ce`;
  const { method, payload, extractedProjectName } = commonPayloadGenerator(
    message,
    projectName,
    ConfigCategories.PAGE.genericFields
  );
  const commonPayload = payload;
  const pagePayload = constructPayload(
    message,
    mappingConfig[ConfigCategories.PAGE.name]
  );
  const mergedPayload = { ...commonPayload, ...pagePayload };

  mergedPayload.event = getEvent(message);
  return responseBuilder(mergedPayload, endpoint, method, extractedProjectName);
};
const process = event => {
  const { message, destination } = event;
  const { projectName } = destination.Config;
  if (!projectName) {
    throw new CustomError(
      "[ WOOPRA ]:: Project Name field can not be empty.",
      400
    );
  }
  if (!message.type) {
    throw new CustomError(
      "[ WOOPRA ]:: Message Type is not present. Aborting message.",
      400
    );
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
      throw new CustomError(
        `[ WOOPRA ]:: Message type ${messageType} not supported.`,
        400
      );
  }
  return response;
};
const processRouterDest = async inputs => {
  if (!Array.isArray(inputs) || inputs.length <= 0) {
    const respEvents = getErrorRespEvents(null, 400, "Invalid event array");
    return [respEvents];
  }

  return Promise.all(
    inputs.map(async input => {
      try {
        if (input.message.statusCode) {
          // already transformed event
          return getSuccessRespEvents(
            input.message,
            [input.metadata],
            input.destination
          );
        }
        // if not transformed
        return getSuccessRespEvents(
          await process(input),
          [input.metadata],
          input.destination
        );
      } catch (error) {
        return getErrorRespEvents(
          [input.metadata],
          error.response ? error.response.status : error.code || 400,
          error.message || "Error occurred while processing payload."
        );
      }
    })
  );
};

module.exports = { process, processRouterDest };
