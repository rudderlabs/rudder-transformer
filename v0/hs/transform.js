const get = require("get-value");
const set = require("set-value");
const { EventType } = require("../../constants");
const { defaultRequestConfig, removeUndefinedValues } = require("../util");
const { ConfigCategory, mappingConfig } = require("./config");

const hSIdentifyConfigJson = mappingConfig[ConfigCategory.IDENTIFY.name];

function processTrack(message, destination) {
  const parameters = {
    _a: destination.Config.hubId,
    _n: message.event
  };

  if (message.properties.revenue) {
    parameters["_m"] = revenue;
  }
  const userProperties = getTransformedJSON(message, hSIdentifyConfigJson);

  return responseBuilderSimple(
    { ...parameters, ...userProperties },
    message,
    EventType.TRACK,
    destination
  );
}

function processIdentify(message) {
  const userProperties = getTransformedJSON(message, hSIdentifyConfigJson);
  const properties = getPropertyValueForIdentify(userProperties);
  return responseBuilderSimple(
    { properties },
    message,
    EventType.IDENTIFY,
    destination
  );
}

function responseBuilderSimple(payload, message, eventType, destination) {
  let endpoint = "https://track.hubspot.com/v1/event/";
  let requestConfig = defaultRequestConfig;

  if (eventType !== EventType.TRACK) {
    const { email } = message.context.traits;
    const { apiKey } = destination.Config;
    if (email) {
      endpoint =
        "https://api.hubapi.com/contacts/v1/contact/createOrUpdate/email/" +
        email +
        "/?hapikey=" +
        apiKey;
    } else {
      endpoint =
        "https://api.hubapi.com/contacts/v1/contact/?hapikey=" + apiKey;
    }
    requestConfig["requestMethod"] = "POST";
    requestConfig["requestFormat"] = "JSON";
  }

  return {
    endpoint,
    header: {},
    user_id: message.anonymous_id,
    requestConfig,
    payload: removeUndefinedValues(payload)
  };
}

function getPropertyValueForIdentify(propMap) {
  return Object.keys(propMap).map(key => {
    return { property: key, value: propMap[key] };
  });
}

function getTransformedJSON(message, mappingJson) {
  const rawPayload = {};

  const sourceKeys = Object.keys(mappingJson);
  sourceKeys.forEach(sourceKey => {
    set(rawPayload, mappingJson[sourceKey], get(message, sourceKey));
  });
  return { ...rawPayload, ...message.user_properties };
}

function processSingleMessage(message, destination) {
  const messageType = message.type;
  let response;
  switch (messageType) {
    case EventType.TRACK:
      response = processTrack(message, destination);
      break;
    case EventType.IDENTIFY:
      response = processIdentify(message, destination);
      break;
  }
  return response;
}

function process(events) {
  const respList = [];

  events.forEach(event => {
    const result = processSingleMessage(event.message, event.destination);
    respList.push(result);
  });

  return respList;
}

exports.process = process;
