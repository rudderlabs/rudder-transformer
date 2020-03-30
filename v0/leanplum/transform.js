const get = require("get-value");
const set = require("set-value");

const { EventType } = require("../../constants");
const {
  ConfigCategory,
  mappingConfig,
  ENDPOINT,
  API_VERSION
} = require("./config");
const {
  removeUndefinedValues,
  defaultPostRequestConfig,
  defaultRequestConfig
} = require("../util");

function setValues(payload, message, mappingJson) {
  if (Array.isArray(mappingJson)) {
    let val;
    let sourceKeys;
    mappingJson.forEach(mapping => {
      val = undefined;
      sourceKeys = mapping.sourceKeys;
      if (Array.isArray(sourceKeys) && sourceKeys.length > 0) {
        for (let index = 0; index < sourceKeys.length; index++) {
          val = get(message, sourceKeys[index]);
          if (val) {
            break;
          }
        }

        if (val) {
          set(payload, mapping.destKey, val);
        } else if (mapping.required) {
          throw new Error(
            `One of ${JSON.stringify(mapping.sourceKeys)} is required`
          );
        }
      }
    });
  }
  // console.log(payload);
  return payload;
}

function constructPayload(message, name, destination) {
  mappingJson = mappingConfig[name];
  let rawPayload = {
    appId: destination.Config.applicationId,
    clientKey: destination.Config.clientKey,
    apiVersion: API_VERSION
  };

  rawPayload = setValues(rawPayload, message, mappingJson);

  if (rawPayload.newUserId === "") {
    delete rawPayload.newUserId;
  }

  if (destination.Config.isDevelop) {
    rawPayload.devMode = true;
  }

  // special case for "created", "time"
  // ideally we should add data type field in the json and handle it
  if (rawPayload.created) {
    const created = Math.round(new Date(rawPayload.created).getTime() / 1000);
    rawPayload.created = created;
  }
  if (rawPayload.time) {
    const time = Math.round(new Date(rawPayload.time).getTime() / 1000);
    rawPayload.time = time;
  }

  return removeUndefinedValues(rawPayload);
}

function responseBuilderSimple(message, category, destination) {
  const response = defaultRequestConfig();
  response.endpoint = ENDPOINT;
  response.method = defaultPostRequestConfig.requestMethod;
  response.headers = {
    "Content-Type": "application/json"
  };
  response.userId = message.userId ? message.userId : message.anonymousId;
  response.body.JSON = constructPayload(message, category.name, destination);
  response.params = {
    action: category.action
  };

  return response;
}

function startSession(message, destination) {
  return responseBuilderSimple(message, ConfigCategory.START, destination);
}

function processSingleMessage(message, destination) {
  if (!message.type) {
    throw Error("Message Type is not present. Aborting message.");
  }
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
    case EventType.SCREEN:
      category = ConfigCategory.SCREEN;
      break;
    default:
      throw new Error("Message type not supported");
  }

  // build the response
  const response = responseBuilderSimple(message, category, destination);

  let respList = [];

  // all event types except idetify requires startSession
  if (messageType !== EventType.IDENTIFY) {
    respList = [startSession(message, destination)];
  }

  return [...respList, response];
}

function process(event) {
  return processSingleMessage(event.message, event.destination);
}

exports.process = process;
