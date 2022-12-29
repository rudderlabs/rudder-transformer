/* eslint-disable no-nested-ternary */
const get = require("get-value");
const set = require("set-value");
const {
  defaultPostRequestConfig,
  defaultPutRequestConfig,
  defaultPatchRequestConfig,
  defaultGetRequestConfig,
  defaultRequestConfig,
  getHashFromArray,
  getFieldValueFromMessage,
  flattenJson,
  isDefinedAndNotNull,
  simpleProcessRouterDest,
  defaultDeleteRequestConfig,
  getIntegrationsObj
} = require("../../util");
const { TRANSFORMER_METRIC } = require("../../util/constant");
const ErrorBuilder = require("../../util/error");

const { simpleProcessRouterDest } = require("../../util");
const { EventType } = require("../../../constants");
const { ConfigurationError } = require("../../util/errorTypes");

const getPropertyParams = message => {
  if (message.type === EventType.IDENTIFY) {
    return flattenJson(getFieldValueFromMessage(message, "traits"));
  }
  return flattenJson(message.properties);
};
const processEvent = event => {
  const { DESTINATION, message, destination } = event;
  try {
    const integrationsObj = getIntegrationsObj(message, DESTINATION);
    // set context.ip from request_ip if it is missing
    if (
      !get(message, "context.ip") &&
      isDefinedAndNotNull(message.request_ip)
    ) {
      set(message, "context.ip", message.request_ip);
    }
    const response = defaultRequestConfig();
    const url = destination.Config[`${DESTINATION}Url`];
    // || destination.Config?.pipedreamUrl;
    const method = destination.Config[`${DESTINATION}Method`];
    // || destination.Config?.pipedreamMethod;
    const { headers } = destination.Config;

    if (url) {
      switch (method) {
        case defaultGetRequestConfig.requestMethod: {
          response.method = defaultGetRequestConfig.requestMethod;
          response.params = getPropertyParams(message);
          break;
        }
        case defaultPutRequestConfig.requestMethod: {
          response.method = defaultPutRequestConfig.requestMethod;
          response.body.JSON = message;
          response.headers = {
            "content-type": "application/json"
          };
          break;
        }
        case defaultPatchRequestConfig.requestMethod: {
          response.method = defaultPatchRequestConfig.requestMethod;
          response.body.JSON = message;
          response.headers = {
            "content-type": "application/json"
          };
          break;
        }
        case defaultDeleteRequestConfig.requestMethod: {
          response.method = defaultDeleteRequestConfig.requestMethod;
          response.params = getPropertyParams(message);
          break;
        }
        case defaultPostRequestConfig.requestMethod:
        default: {
          response.method = defaultPostRequestConfig.requestMethod;
          response.body.JSON = message;
          response.headers = {
            "content-type": "application/json"
          };
          break;
        }
};
const DESTINATION = "webhook";
const process = event => {
  const response = processEvent({ ...event, DESTINATION });
  return response;
};

const processRouterDest = async inputs => {
  const destNameRichInputs = inputs.map(input => {
    return { ...input, DESTINATION };
  });
  const respList = await simpleProcessRouterDest(
    destNameRichInputs,
    DESTINATION,
    processEvent
  );
};

module.exports = { processEvent, process, processRouterDest };
