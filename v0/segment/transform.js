const get = require("get-value");
let { destinationConfigKeys, batchEndpoint } = require("./config");
const { defaultPostRequestConfig } = require("../util");
let writeKey;

function responseBuilderSimple(payload) {
  let basicAuth = new Buffer(`${writeKey}` + ":" + ``).toString("base64");

  const response = {
    endpoint: batchEndpoint,
    header: {
      "Content-Type": "application/json",
      Authorization: `Basic ${basicAuth}`
    },
    requestConfig: defaultPostRequestConfig,
    userId: message.anonymousId,
    payload
  };
  return response;
}

function removeNullValues(payload) {
  let newPayload = {};
  var vals = Object.keys(payload);
  for (var i = 0; i < vals.length; i++) {
    let currentVal = vals[i];
    if (payload[currentVal] != (null || undefined)) {
      newPayload[currentVal] = payload[currentVal];
    }
  }
  return newPayload;
}

function makePayload(type, userId, event, traits, properties, timeStamp) {
  let eventPayload = {};
  eventPayload.type = type;
  eventPayload.userId = userId;
  eventPayload.event = event;
  eventPayload.traits = traits;
  eventPayload.properties = properties;
  eventPayload.timeStamp = timeStamp;
  return removeNullValues(eventPayload);
}

function getTransformedJSON(message) {
  const type = message.type;
  const userId = message.userId ? message.userId : message.anonymousId;
  const traits = get(message, "context.traits")
    ? message.context.traits
    : undefined;
  delete traits.anonymousId;
  const properties = get(message, "context.properties")
    ? message.context.properties
    : undefined;
  const event = get(message, "event") ? message.event : undefined;
  const timeStamp = message.originalTimestamp;

  return makePayload(type, userId, event, traits, properties, timeStamp);
}

function setDestinationKeys(destination) {
  const keys = Object.keys(destination.Config);
  keys.forEach(key => {
    switch (key) {
      case destinationConfigKeys.writeKey:
        writeKey = `${destination.Config[key]}`;
        break;
      default:
        break;
    }
  });
}

function processSingleMessage(message, destination) {
  setDestinationKeys(destination);
  return getTransformedJSON(message, destination);
}

function process(events) {
  let respObj = {};
  respObj.batch = [];
  events.forEach(event => {
    try {
      response = processSingleMessage(event.message, event.destination);
      respObj.batch.push(response);
    } catch (error) {
      respObj.batch.push({ statusCode: 400, error: error.message });
    }
  });
  return responseBuilderSimple(respObj, message);
}

exports.process = process;
