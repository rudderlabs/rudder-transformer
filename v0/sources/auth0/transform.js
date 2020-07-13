const path = require("path");
const fs = require("fs");
const _ = require("lodash");
// import mapping json using JSON.parse to preserve object key order
const mapping = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, "./mapping.json"), "utf-8")
);
const Message = require("../message");

// Ref: https://auth0.com/docs/logs/references/log-event-type-codes
const eventNameMap = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, "./eventMapping.json"), "utf-8")
);

// ideally this should go under utils
// we should move the utils class out of the destinations folder
// and put under a common place so that both sources and destinations can use that
// will take that in a separate PR
const isDefined = x => !_.isUndefined(x);
const isNotNull = x => x != null;
const isDefinedAndNotNull = x => isDefined(x) && isNotNull(x);
const removeUndefinedAndNullValues = obj => _.pickBy(obj, isDefinedAndNotNull);

function processEvent(event) {
  const messageType = "track";

  if (event.type) {
    const eventType = event.type;
    const message = new Message(`Auth0`);

    // since only email status events are supported, event type is always track
    message.setEventType(messageType);

    const eventName = eventNameMap[eventType] || eventType;
    message.setEventName(eventName);

    message.setProperties(event, mapping);

    if (event.date) {
      message.setProperty("originalTimestamp", event.date);
      message.setProperty("sentAt", event.date);
    }

    return message;
  }
  throw new Error("Unknwon event type from Auth0");
}

function process(events) {
  const responses = [];
  events.forEach(event => {
    try {
      responses.push(removeUndefinedAndNullValues(processEvent(event)));
    } catch (error) {
      // TODO: figure out a way to handle partial failures within batch
      // responses.push({
      //   statusCode: 400,
      //   error: error.message || "Unknwon error"
      // });
    }
  });
  if (responses.length === 0) {
    throw new Error("All requests in the batch failed");
  } else {
    return responses;
  }
}

exports.process = process;
