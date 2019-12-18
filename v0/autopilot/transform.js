const get = require("get-value");
const { EventType } = require("../../constants");
const { destinationConfigKeys, endpoints } = require("./config");
const { mapPayload } = require("./data/eventMapping");
const {
  defaultPostRequestConfig,
  updatePayload,
  removeUndefinedAndNullValues
} = require("../util");

function responseBuilderSimple(payload, message, autoPilotConfig) {
  let endpoint;
  let requestConfig;

  switch (message.type) {
    case EventType.IDENTIFY:
      requestConfig = defaultPostRequestConfig;
      endpoint = endpoints.addContactUrl;
      break;
    case EventType.TRACK:
      requestConfig = defaultPostRequestConfig;
      endpoint = `${endpoints.triggerJourneyUrl}/${autoPilotConfig.triggerId}`;
      break;
    default:
      break;
  }

  const response = {
    endpoint,
    header: {
      autopilotapikey: `${autoPilotConfig.apiKey}`
    },
    requestConfig,
    userId: message.userId ? message.userId : message.anonymousId,
    payload: removeUndefinedAndNullValues(payload)
  };
  return response;
}

function getIdentifyPayload(message) {
  let rawPayload = {};
  let contact = {};

  const traits = get(message.context.traits) ? message.context.traits : null;

  if (traits != null) {
    Object.keys(traits).forEach(trait => {
      const value = traits[trait];
      const replaceKeys = mapPayload.identify.addContact;
      updatePayload(trait, replaceKeys, value, contact);
    });
  }

  rawPayload.contact = contact;
  return rawPayload;
}

function getTrackPayload(message) {
  let rawPayload = {};
  let propertiesObj = {};
  let contactObj = {};
  const properties = get(message, "properties")
    ? Object.keys(message.properties)
    : null;

  const contextFields = get(message.context)
    ? Object.keys(message.context)
    : null;

  if (properties != null && context != null) {
    properties.forEach(property => {
      propertiesObj[property] = properties[property];
    });
    contextFields.forEach(field => {
      contactObj[field] = contextFields[field];
    });
  }

  rawPayload.property = propertiesObj;
  rawPayload.contact = contactObj;
  return rawPayload;
}

function getTransformedJSON(message, autoPilotConfig) {
  let rawPayload;
  switch (message.type) {
    case EventType.TRACK:
      rawPayload = getTrackPayload(message);
      break;
    case EventType.IDENTIFY:
      rawPayload = getIdentifyPayload(message);
      break;
    default:
      break;
  }
  return { ...rawPayload };
}

function getDestinationKeys(destination) {
  let autoPilotConfig = {};
  const configKeys = Object.keys(destination.Config);
  configKeys.forEach(key => {
    switch (key) {
      case destinationConfigKeys.apiKey:
        autoPilotConfig.apiKey = `${destination.Config[key]}`;
        break;
      case destinationConfigKeys.triggerId:
        autoPilotConfig.triggerId = `${destination.Config[key]}`;
        break;
      default:
        break;
    }
  });
  return autoPilotConfig;
}

function processSingleMessage(message, destination) {
  const autoPilotConfig = getDestinationKeys(destination);
  const properties = getTransformedJSON(message, autoPilotConfig);
  return responseBuilderSimple(properties, message, autoPilotConfig);
}

function process(events) {
  let respList = [];
  events.forEach(event => {
    try {
      response = processSingleMessage(event.message, event.destination);
      respList.push(response);
    } catch (error) {
      respList.push({ statusCode: 400, error: error.message });
    }
  });
  return respList;
}

exports.process = process;
