const { EventType } = require('../../../constants');
const { ConfigCategory, mappingConfig, ENDPOINT, API_VERSION } = require('./config');
const {
  removeUndefinedValues,
  defaultPostRequestConfig,
  defaultRequestConfig,
  constructPayload,
  simpleProcessRouterDest,
} = require('../../util');
const { InstrumentationError } = require('../../util/errorTypes');
const { JSON_MIME_TYPE } = require('../../util/constant');

function preparePayload(message, name, destination) {
  const mappingJson = mappingConfig[name];
  const rawPayload = {
    appId: destination.Config.applicationId,
    clientKey: destination.Config.clientKey,
    apiVersion: API_VERSION,
    ...constructPayload(message, mappingJson),
  };

  if (rawPayload.newUserId === '') {
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
    'Content-Type': JSON_MIME_TYPE,
  };
  response.userId = message.anonymousId;
  response.body.JSON = preparePayload(message, category.name, destination);
  response.params = {
    action: category.action,
  };

  return response;
}

function startSession(message, destination) {
  return responseBuilderSimple(message, ConfigCategory.START, destination);
}

function processSingleMessage(message, destination) {
  if (!message.type) {
    throw new InstrumentationError('Event type is required');
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
      throw new InstrumentationError(`Event type ${messageType} is not supported`);
  }

  // build the response
  const response = responseBuilderSimple(message, category, destination);

  // all event types except idetify requires startSession
  if (messageType !== EventType.IDENTIFY) {
    return [startSession(message, destination), response];
  }

  return response;
}

function process(event) {
  return processSingleMessage(event.message, event.destination);
}

const processRouterDest = async (inputs, reqMetadata) => {
  const respList = await simpleProcessRouterDest(inputs, process, reqMetadata);
  return respList;
};

module.exports = { process, processRouterDest };
