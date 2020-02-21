const get = require("get-value");
const set = require("set-value");

const { EventType } = require("../../constants");
const { ConfigCategory, mappingConfig, ENDPOINT } = require("./config");
const {
  removeUndefinedValues,
  defaultPostRequestConfig,
  defaultRequestConfig
} = require("../util");

function responseBuilderSimple(message, category, destination) {
  mappingJson = mappingConfig[category.name];
  const rawPayload = {
    appId: destination.Config.appId,
    clientKey: destination.Config.clientKey,
    apiVersion: destination.Config.apiVersion
  };

  const sourceKeys = Object.keys(mappingJson);
  sourceKeys.forEach(sourceKey => {
    set(rawPayload, mappingJson[sourceKey], get(message, sourceKey));
  });
  // sending anonymousId if userId is not present
  rawPayload.userId = rawPayload.userId
    ? rawPayload.userId
    : message.anonymousId;
  const payload = removeUndefinedValues(rawPayload);

  const response = defaultRequestConfig();
  response.endpoint = ENDPOINT;
  response.method = defaultPostRequestConfig.requestMethod;
  response.headers = {
    "Content-Type": "application/json"
  };
  // check userId
  response.userId = message.userId ? message.userId : message.anonymousId;
  response.body.JSON = payload;
  response.params = {
    action: category.action
  };

  return response;
}

function processSingleMessage(message, destination) {
  const messageType = message.type.toLowerCase();
  let category;

  switch (messageType) {
    case EventType.PAGE:
      category = ConfigCategory.PAGE;
      break;
    case EventType.IDENTIFY:
      category = ConfigCategory.IDENTIFY;
      break;
    case EventType.TRACK:
      category = ConfigCategory.TRACK;
      break;
    default:
      throw new Error("Message type not supported");
  }

  return responseBuilderSimple(message, category, destination);
}

function process(event) {
  const resp = processSingleMessage(event.message, event.destination);
  return resp;
}

exports.process = process;
