const get = require("get-value");
let { destinationConfigKeys, batchEndpoint } = require("./config");
const { defaultPostRequestConfig } = require("../util");

function responseBuilderSimple(payload, keysObj) {
  let basicAuth = new Buffer(`${keysObj.writeKey}` + ":" + ``).toString(
    "base64"
  );

  const response = {
    endpoint: batchEndpoint,
    header: {
      "Content-Type": "application/json",
      Authorization: `Basic ${basicAuth}`
    },
    requestConfig: defaultPostRequestConfig,
    userId: "123",
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

function makePayload(
  type,
  userId,
  event,
  traits,
  properties,
  timeStamp,
  keysObj
) {
  let eventPayload = {};
  eventPayload.type = type;
  eventPayload.userId = userId;
  eventPayload.event = event;
  eventPayload.traits = traits;
  eventPayload.properties = properties;
  eventPayload.timeStamp = timeStamp;
  return {
    payload: removeNullValues(eventPayload),
    keys: keysObj
  };
}

function getTransformedJSON(message, keysObj) {
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

  return makePayload(
    type,
    userId,
    event,
    traits,
    properties,
    timeStamp,
    keysObj
  );
}

function setDestinationKeys(destination) {
  let keysObj = {};
  const keys = Object.keys(destination.Config);
  keys.forEach(key => {
    switch (key) {
      case destinationConfigKeys.writeKey:
        keysObj.writeKey = `${destination.Config[key]}`;
        break;
      default:
        break;
    }
  });
  return keysObj;
}

function processSingleMessage(message, destination) {
  const keysObj = setDestinationKeys(destination);
  return getTransformedJSON(message, keysObj);
}

function process(events) {
  let respObj = {};
  respObj.batch = [];
  let keys;
  events.forEach(event => {
    try {
      responseObj = processSingleMessage(event.message, event.destination);
      respObj.payload.batch.push(response);
      keys = responseObj.keys;
    } catch (error) {
      respObj.batch.push({ statusCode: 400, error: error.message });
    }
  });
  return responseBuilderSimple(respObj, keys);
}

exports.process = process;
