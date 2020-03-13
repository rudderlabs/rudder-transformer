/* eslint-disable no-else-return */
/* eslint-disable no-await-in-loop */
const get = require("get-value");
const set = require("set-value");
const axios = require("axios");

const { EventType } = require("../../constants");
const {
  ConfigCategory,
  mappingConfig,
  ENDPOINT,
  API_VERSION,
  RETRY_COUNT
} = require("./config");
const {
  removeUndefinedValues,
  defaultPostRequestConfig,
  defaultRequestConfig
} = require("../util");

async function startSession(message, destination) {
  let retryCount = 0;
  let success = false;
  const payload = {
    appId: destination.Config.applicationId,
    clientKey: destination.Config.clientKey,
    apiVersion: API_VERSION
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

  while (!success && retryCount < RETRY_COUNT) {
    try {
      const response = await axios.post(url, payload);
      if (response.status === 200) {
        success = true;
      }
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.response
      ) {
        if (error.response.status === 429) {
          // retry only for throttling
          retryCount += 1;
        } else {
          break;
        }
      }
    }
  }

  if (!success) {
    throw new Error("Start Session failed for LeanPlum");
  }
}

function setValues(payload, message, mappingJson) {
  if(Array.isArray(mappingJson)) {
    let val;
    let sourceKeys;
    mappingJson.forEach( mapping => {
      val = undefined;
      sourceKeys = mapping.sourceKeys;
      if(Array.isArray(sourceKeys) && sourceKeys.length > 0) {
        for (let index = 0; index < sourceKeys.length; index++) {
          val = get(message, sourceKeys[index]);
          if (val) {
            break;
          }
        }

        if(val) {
          set(payload, mapping.destKey, val);
        }
        else {
          if(mapping.required) {
            throw new Error(`One of ${mapping.sourceKeys} is required`);
          }
        }
      }
    });
  }
  // console.log(payload);
  return payload;
}

function responseBuilderSimple(message, category, destination) {
  mappingJson = mappingConfig[category.name];
  let rawPayload = {
    appId: destination.Config.applicationId,
    clientKey: destination.Config.clientKey,
    apiVersion: API_VERSION
  };
  
  rawPayload = setValues(rawPayload, message, mappingJson);

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

  // all event types except idetify requires startSession
  if (messageType !== EventType.IDENTIFY) {
    await startSession(message, destination);
  }

  return response;
}

async function process(event) {
  const resp = await processSingleMessage(event.message, event.destination);
  return resp;
}

exports.process = process;
