const get = require("get-value");
const set = require("set-value");
const axios = require("axios");

const { EventType } = require("../../constants");
const { ConfigCategory, mappingConfig, ENDPOINT } = require("./config");
const {
  removeUndefinedValues,
  defaultPostRequestConfig,
  defaultRequestConfig
} = require("../util");

async function startSession(message, destination) {
  const payload = {
    appId: destination.Config.applicationId,
    clientKey: destination.Config.clientKey,
    apiVersion: destination.Config.apiVersion
  };

  if (destination.Config.isDevelop) {
    payload.devMode = true;
  }
  if (message.originalTimestamp) {
    payload.time = Math.round(
      new Date(message.originalTimestamp).getTime() / 1000
    );
  }

  payload.userId = message.userId ? message.userId : message.anonymousId;
  const url = ENDPOINT + "?action=start";
  try {
    await axios.post(url, payload);
  } catch (error) {
    if (error.response && error.response.data && error.response.data.response) {
      console.log(
        "Error in start API call: ",
        error.response.data.response[0].error.message
      );
    }
  }
}

function responseBuilderSimple(message, category, destination) {
  mappingJson = mappingConfig[category.name];
  const rawPayload = {
    appId: destination.Config.applicationId,
    clientKey: destination.Config.clientKey,
    apiVersion: destination.Config.apiVersion
  };

  const sourceKeys = Object.keys(mappingJson);
  sourceKeys.forEach(sourceKey => {
    set(rawPayload, mappingJson[sourceKey], get(message, sourceKey));
  });
  if (rawPayload.newUserId === "") {
    delete rawPayload.newUserId;
  }
  // sending anonymousId if userId is not present
  rawPayload.userId = rawPayload.userId
    ? rawPayload.userId
    : message.userId
    ? message.userId
    : message.anonymousId;

  if (destination.Config.isDevelop) {
    rawPayload.devMode = true;
  }

  rawPayload.time = Math.round(new Date().getTime() / 1000);
  const payload = removeUndefinedValues(rawPayload);

  const response = defaultRequestConfig();
  response.endpoint = ENDPOINT;
  response.method = defaultPostRequestConfig.requestMethod;
  response.headers = {
    "Content-Type": "application/json"
  };
  response.userId = message.userId ? message.userId : message.anonymousId;
  response.body.JSON = payload;
  response.params = {
    action: category.action
  };

  return response;
}

async function processSingleMessage(message, destination) {
  const messageType = message.type.toLowerCase();
  let category;

  switch (messageType) {
    case EventType.PAGE:
      await startSession(message, destination);
      category = ConfigCategory.PAGE;
      break;
    case EventType.IDENTIFY:
      category = ConfigCategory.IDENTIFY;
      break;
    case EventType.TRACK:
      await startSession(message, destination);
      category = ConfigCategory.TRACK;
      break;
    default:
      throw new Error("Message type not supported");
  }

  return responseBuilderSimple(message, category, destination);
}

async function process(event) {
  const resp = await processSingleMessage(event.message, event.destination);
  return resp;
}

exports.process = process;
