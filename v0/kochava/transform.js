const get = require("get-value");
const { EventType } = require("../../constants");
const {
  KOCHAVA_ENDPOINT,
  mappingConfig,
  eventNameMapping
} = require("./config");
const { removeUndefinedValues, defaultRequestConfig } = require("../util");

// build final response
// --------------------
// Params:
// 1. data.event_data (pass as it is to kochava payload)
// 2. raw message from rudder
// 3. mapping json for context properties
// 4. destination object for keys
function responseBuilder(eventData, message, mappingJson, destination) {
  // set the mandatory fields for kochava
  const rawPayload = {
    action: "event",
    kochava_app_id: destination.Config.guid,
    kochava_device_id: message.anonymousId,
    send_date: message.originalTimestamp
  };

  // map values from message.context to payload.data for kochava
  const sourceKeys = Object.keys(mappingJson);
  const data = {};
  sourceKeys.forEach(sourceKey => {
    data[mappingJson[sourceKey]] = get(message, sourceKey);
  });

  // modify the supported event names for standard events in kochava
  if (data.event_name) {
    const eventName = data.event_name.toLowerCase();
    if (eventNameMapping[eventName] != undefined) {
      data.event_name = eventNameMapping[eventName];
    }
  }

  // remove undefined values
  const finalData = removeUndefinedValues(data);
  const eventPayload = removeUndefinedValues(eventData);
  // final data object to be passed to the payload
  const dataPayload = { ...finalData, event_data: eventPayload };
  // final payload to be sent to kochava
  const payload = { ...rawPayload, data: dataPayload };

  // construct the response and return
  const response = defaultRequestConfig();
  response.endpoint = KOCHAVA_ENDPOINT;
  response.userId =
    message.userId && message.userId.length > 0
      ? message.userId
      : message.anonymousId;
  response.body.JSON = payload;
  return response;
}

// convert the specific keys, and pass other properties as it is under data.event_data
function processTrackEvents(message) {
  return message.properties;
}

// process only `track` and `identify` events
function processMessage(message, destination) {
  const messageType = message.type.toLowerCase();
  let customParams = {};

  switch (messageType) {
    case EventType.SCREEN:
      // `screen` event is not supported
      throw new Error("message type not supported");
    case EventType.PAGE:
      // `page` event is not supported
      throw new Error("message type not supported");
    case EventType.IDENTIFY:
      // process `identify` event
      throw new Error("message type not supported");
    case EventType.TRACK:
      // process `track` event
      customParams = processTrackEvents(message);
      break;
    default:
      throw new Error("message type not supported");
  }

  return responseBuilder(
    customParams,
    message,
    mappingConfig.KochavaGenericEvent,
    destination
  );
}

// process message
async function process(event) {
  const result = processMessage(event.message, event.destination);
  if (!result.statusCode) {
    result.statusCode = 200;
  }
  return result;
}

exports.process = process;
