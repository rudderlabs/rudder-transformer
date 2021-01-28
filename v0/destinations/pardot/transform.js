const { EventType } = require("../../../constants");
const { identifyConfig, BASE_ENDPOINT } = require("./config");
const {
  defaultRequestConfig,
  getFieldValueFromMessage,
  constructPayload,
  defaultPostRequestConfig
} = require("../../util");

const responseBuilderSimple = (message, destination) => {
  const payload = {};
  const contact = constructPayload(message, identifyConfig);
  payload.contact = contact;

  const responseBody = { ...payload, apiKey: destination.Config.apiKey };
  const response = defaultRequestConfig();
  response.endpoint = `${destination.Config.apiUrl}${BASE_ENDPOINT}`;
  response.method = defaultPostRequestConfig.requestMethod;
  response.body.JSON = responseBody;
  return response;

  // fail-safety for developer error
  // throw new Error("Payload could not be constructed");
};

// Consider only Identify call for Pardot for now

const processEvent = (message, destination) => {
  if (!message.type) {
    throw Error("Message Type is not present. Aborting message.");
  }

  return responseBuilderSimple(message, destination);
};

const process = event => {
  return processEvent(event.message, event.destination);
};

exports.process = process;
