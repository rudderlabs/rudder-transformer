const get = require("get-value");
const { EventType } = require("../../constants");
const { destinationConfigKeys, endpoints } = require("./config");
const { mapPayload } = require("./data/eventMapping");
const {
  defaultPostRequestConfig,
  updatePayload,
  removeUndefinedAndNullValues,
  defaultRequestConfig
} = require("../util");

function getTriggerId(message, autoPilotConfig) {
  let triggerId = null;
  const eventName = message.event;
  Object.keys(autoPilotConfig).map(configKey => {
    if (eventName.toLowerCase() === configKey.toLowerCase()) {
      triggerId = autoPilotConfig[configKey];
    }
  });
  if (triggerId === null) {
    triggerId = autoPilotConfig.triggerId;
  }
  return triggerId;
}

function responseBuilder(payload, message, autoPilotConfig) {
  let response = defaultRequestConfig();
  switch (message.type) {
    case EventType.IDENTIFY:
      response.endpoint = endpoints.addContactUrl;
      response.method = defaultPostRequestConfig.requestMethod;
      break;
    case EventType.TRACK:
      const triggerId = getTriggerId(message, autoPilotConfig);
      response.endpoint = `${endpoints.triggerJourneyUrl}/${triggerId}/contact/${message.context.traits.email}`;
      response.method = defaultPostRequestConfig.requestMethod;
      break;
    default:
      break;
  }

  return {
    ...response,
    header: {
      autopilotapikey: `${autoPilotConfig.apiKey}`,
      "Content-Type": "application/json",
      Accept: "application/json"
    },
    userId: message.userId ? message.userId : message.anonymousId,
    payload: removeUndefinedAndNullValues(payload)
  };
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

  const properties = get(message.properties)
    ? Object.keys(message.properties)
    : null;

  if (properties != null) {
    properties.forEach(property => {
      propertiesObj[property] = message.properties[property];
    });
  }

  rawPayload.property = propertiesObj;
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
      case destinationConfigKeys.customMappings:
        destination.Config.customMappings.map(obj => {
          const key = obj.to;
          const value = obj.from;
          autoPilotConfig[key] = value;
        });
    }
  });
  return autoPilotConfig;
}

function process(event) {
  const autoPilotConfig = getDestinationKeys(event.destination);
  const properties = getTransformedJSON(event.message, autoPilotConfig);
  return responseBuilder(properties, event.message, autoPilotConfig);
}

exports.process = process;
