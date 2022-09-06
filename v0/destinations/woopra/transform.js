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
const { refinePayload } = require("./utils");

const responseBuilder = async (payload, endpoint, method, projectName) => {
  if (!payload) {
    throw new CustomError("[ WOOPRA ]:: Parameters could not be found", 400);
  }
  if (!get(payload, "project")) {
    set(payload, "Project", projectName);
  }
  const response = defaultRequestConfig();
  response.params = removeUndefinedAndNullValues(payload);
  response.endpoint = endpoint;
  response.method = method;
  return response;
};

const identifyResponseBuilder = async (message, projectName) => {
  const endpoint = `${BASE_URL}/identify`;
  const payload = constructPayload(
    message,
    mappingConfig[ConfigCategories.IDENTIFY.name]
  );
  refinePayload(message, payload);
  projectName =
    getIntegrationsObj(message, "woopra")?.projectName || projectName;

  return responseBuilder(
    payload,
    endpoint,
    defaultGetRequestConfig.requestMethod,
    projectName
  );
};
const trackResponseBuilder = async (message, projectName) => {
  const endpoint = `${BASE_URL}/ce`;
  if (!message.event) {
    throw new CustomError("[ WOOPRA ]:: Event Name can not be empty.", 400);
  }
  const payload = constructPayload(
    message,
    mappingConfig[ConfigCategories.TRACK.name]
  );
  refinePayload(message, payload);
  projectName =
    getIntegrationsObj(message, "woopra")?.projectName || projectName;
  return responseBuilder(
    payload,
    endpoint,
    defaultGetRequestConfig.requestMethod,
    projectName
  );
};
const pageResponseBuilder = async (message, projectName) => {
  const endpoint = `${BASE_URL}/ce`;
  if (!message.name) {
    throw new CustomError("[ WOOPRA ]:: Page Name can not be empty.", 400);
  }
  const payload = constructPayload(
    message,
    mappingConfig[ConfigCategories.PAGE.name]
  );
  refinePayload(message, payload);
  projectName =
    getIntegrationsObj(message, "woopra")?.projectName || projectName;
  return responseBuilder(
    payload,
    endpoint,
    defaultGetRequestConfig.requestMethod,
    projectName
  );
};
const process = async event => {
  const { message, destination } = event;
  const { projectName } = destination.Config;
  if (!projectName) {
    throw new CustomError("[ WOOPRA ]:: Project Name field can not be empty.", 400);
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
      response = await identifyResponseBuilder(message, projectName);
      break;
    case EventType.TRACK:
      response = await trackResponseBuilder(message, projectName);
      break;
    case EventType.PAGE:
      response = await pageResponseBuilder(message, projectName);
      break;
    default:
      throw new CustomError(`[ WOOPRA ]:: Message type ${messageType} not supported.`, 400);
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
