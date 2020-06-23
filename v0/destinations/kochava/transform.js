const get = require("get-value");
const { EventType } = require("../../../constants");
const {
  KOCHAVA_ENDPOINT,
  mappingConfig,
  eventNameMapping
} = require("./config");
const {
  removeUndefinedValues,
  defaultRequestConfig,
  getParsedIP
} = require("../util");

// build final response
// --------------------
// Params:
// 1. data.event_data (pass as it is to kochava payload)
// 2. raw message from rudder
// 3. mapping json for context properties
// 4. destination object for keys
function responseBuilder(
  eventName,
  eventData,
  message,
  mappingJson,
  destination
) {
  // set the mandatory fields for kochava
  const rawPayload = {
    action: "event",
    kochava_app_id: destination.Config.apiKey,
    kochava_device_id: message.anonymousId,
    send_date: message.originalTimestamp
  };

  // map values from message.context to payload.data for kochava
  const sourceKeys = Object.keys(mappingJson);
  const data = {};
  sourceKeys.forEach(sourceKey => {
    data[mappingJson[sourceKey]] = get(message, sourceKey);
  });

  if (eventName) {
    data.event_name = eventName;
  }

  // remove undefined values
  const finalData = removeUndefinedValues(data);
  const eventPayload = removeUndefinedValues(eventData);
  // final data object to be passed to the payload
  const dataPayload = { ...finalData, event_data: eventPayload };
  dataPayload.origination_ip = getParsedIP(message);
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

// process only `track` and `screen` events
function processMessage(message, destination) {
  const messageType = message.type.toLowerCase();
  let customParams = {};
  let eventName = message.event;

  switch (messageType) {
    case EventType.SCREEN:
      eventName = "screen view";
      if (message.properties && message.properties.name) {
        eventName += ` ${message.properties.name}`;
      }
      customParams = processTrackEvents(message);
      break;
    case EventType.PAGE:
      // `page` event is not supported
      throw new Error("message type not supported");
    case EventType.IDENTIFY:
      // process `identify` event
      throw new Error("message type not supported");
    case EventType.TRACK:
      // process `track` event
      if (eventName) {
        const evName = eventName.toLowerCase();
        if (eventNameMapping[evName] != undefined) {
          eventName = eventNameMapping[evName];
        }
      }
      customParams = processTrackEvents(message);
      break;
    default:
      throw new Error("message type not supported");
  }

  return responseBuilder(
    eventName,
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
