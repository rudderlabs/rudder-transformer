/* eslint-disable camelcase */
const { SHA256 } = require("crypto-js");
const get = require("get-value");
const set = require("set-value");
const { EventType } = require("../../../constants");
const {
  CustomError,
  constructPayload,
  defaultRequestConfig,
  defaultPostRequestConfig,
  defaultPutRequestConfig,
  removeUndefinedAndNullValues,
  extractCustomFields,
  isEmptyObject,
  flattenJson
} = require("../../util");
const {
  identifyMapping,
  MAX_BATCH_SIZE,
  MAILCHIMP_IDENTIFY_EXCLUSION
} = require("./config");

const identifyResponseBuilder = (message, { Config }) => {
  // get common top level rawPayload
  const payload = constructPayload(message, identifyMapping);
  const { apiKey, audienceId, datacenterId } = Config;

  if (!message.context.traits.email) {
    throw new CustomError("Email is required for identify calls ", 400);
  }

  const BASE_URL = `https://${datacenterId}.api.mailchimp.com/3.0/lists/${audienceId}`;
  const IDENTIFY_ENDPOINT = `${BASE_URL}/members`;
  // const BATCH_ENDPOINT = `${BASE_URL}?skip_merge_validation=<${skip_merge_validation}&skip_duplicate_check=${skip_duplicate_check}`;

  let mergeFields = {};
  mergeFields = extractCustomFields(
    message,
    mergeFields,
    ["context.traits"],
    MAILCHIMP_IDENTIFY_EXCLUSION
  );

  if (!isEmptyObject(mergeFields)) {
    mergeFields = flattenJson(mergeFields);
    payload.merge_fields = mergeFields;
  }

  if (payload.params) {
    payload.params = removeUndefinedAndNullValues(payload.params);
  }

  if (isEmptyObject(payload.params)) {
    delete payload.params;
  }

  // build response
  const response = defaultRequestConfig();
  response.method = defaultPutRequestConfig.requestMethod;
  response.endpoint = IDENTIFY_ENDPOINT;
  response.headers = {
    "Content-Type": "application/json",
    Authorization: `Basic ${apiKey}`
  };

  response.body.JSON = payload;
  return response;
};

const process = async event => {
  const { message, destination } = event;

  const destConfig = destination.Config;
  if (!destConfig.apiKey) {
    throw new CustomError("API Key not found. Aborting ", 400);
  }

  if (!destConfig.audienceId) {
    throw new CustomError("Audience Id not found. Aborting", 400);
  }

  if (!destConfig.datacenterId) {
    throw new CustomError("DataCenter Id not found. Aborting", 400);
  }

  if (!message.type) {
    throw new CustomError(
      "Message Type is not present. Aborting message.",
      400
    );
  }

  const messageType = message.type.toLowerCase();

  let response;
  switch (messageType) {
    case EventType.IDENTIFY:
      response = await identifyResponseBuilder(message, destination);
      break;
    default:
      throw new CustomError(`Message type ${messageType} not supported`, 400);
  }
  return response;
};

module.exports = { process };
