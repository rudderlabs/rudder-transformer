const get = require("get-value");
const set = require("set-value");
const axios = require("axios");
const { EventType } = require("../../constants");
const {
  defaultGetRequestConfig,
  defaultPostRequestConfig,
  removeUndefinedValues
} = require("../util");
const { ConfigCategory, mappingConfig } = require("./config");

const hSIdentifyConfigJson = mappingConfig[ConfigCategory.IDENTIFY.name];

let hubSpotPropertyMap = {};

function getKey(key) {
  var re = /\s/g;
  return key.toLowerCase().replace(re, "_");
}

async function getProperties(destination) {
  if (!hubSpotPropertyMap.length) {
    const { apiKey } = destination.Config;
    const url =
      "https://api.hubapi.com/properties/v1/contacts/properties?hapikey=" +
      apiKey;
    const response = await axios.get(url);
    const propertyMap = {};
    response.data.forEach(element => {
      propertyMap[element.name] = element.type;
    });
    hubSpotPropertyMap = propertyMap;
  }
  return hubSpotPropertyMap;
}

async function getTransformedJSON(message, mappingJson, destination) {
  const rawPayload = {};

  const sourceKeys = Object.keys(mappingJson);
  const traitsKeys = Object.keys(message.context.traits);
  const propertyMap = await getProperties(destination);
  sourceKeys.forEach(sourceKey => {
    if (get(message, sourceKey)) {
      set(rawPayload, mappingJson[sourceKey], get(message, sourceKey));
    }
  });
  traitsKeys.forEach(traitsKey => {
    const hsSupportedKey = getKey(traitsKey);
    if (!rawPayload[traitsKey] && propertyMap[hsSupportedKey]) {
      let propValue = message.context.traits[traitsKey];
      if (propertyMap[hsSupportedKey] == "date") {
        var time = propValue;
        var date = new Date(time);
        date.setUTCHours(0, 0, 0, 0);
        propValue = date.getTime();
      }
      rawPayload[hsSupportedKey] = propValue;
    }
  });
  return { ...rawPayload };
}

function getPropertyValueForIdentify(propMap) {
  return Object.keys(propMap).map(key => {
    return { property: key, value: propMap[key] };
  });
}

function responseBuilderSimple(payload, message, eventType, destination) {
  let endpoint = "https://track.hubspot.com/v1/event/";
  let requestConfig = defaultGetRequestConfig;

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
    requestConfig = defaultPostRequestConfig;
  }

  return {
    endpoint,
    header: {},
    userId: message.anonymousId,
    requestConfig,
    payload: removeUndefinedValues(payload)
  };
}

async function processTrack(message, destination) {
  const parameters = {
    _a: destination.Config.hubId,
    _n: message.event
  };

  if (message.properties.revenue || message.properties.value) {
    // eslint-disable-next-line dot-notation
    parameters["_m"] = message.properties.revenue || message.properties.value;
  }
  const userProperties = await getTransformedJSON(
    message,
    hSIdentifyConfigJson,
    destination
  );

  return responseBuilderSimple(
    { ...parameters, ...userProperties },
    message,
    EventType.TRACK,
    destination
  );
}

async function processIdentify(message, destination) {
  const userProperties = await getTransformedJSON(
    message,
    hSIdentifyConfigJson,
    destination
  );
  const properties = getPropertyValueForIdentify(userProperties);
  return responseBuilderSimple(
    { properties },
    message,
    EventType.IDENTIFY,
    destination
  );
}

async function processSingleMessage(message, destination) {
  let response;
  try {
    switch (message.type) {
      case EventType.TRACK:
        response = await processTrack(message, destination);
        response.statusCode = 200;
        break;
      case EventType.IDENTIFY:
        response = await processIdentify(message, destination);
        response.statusCode = 200;
        break;
      default:
        console.log("message type " + message.type + " is not supported");
        response = {
          statusCode: 400,
          error: "message type " + message.type + " is not supported"
        };
    }
  } catch (e) {
    console.log("error occurred while processing payload for HS: ", e);
    response = {
      statusCode: 400,
      error: "error occurred while processing payload."
    };
  }
  return response;
}

async function process(events) {
  let respList = [];
  respList = await Promise.all(
    events.map(event => processSingleMessage(event.message, event.destination))
  );
  return respList;
}
exports.process = process;
