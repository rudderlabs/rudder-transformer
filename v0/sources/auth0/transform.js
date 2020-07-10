const path = require("path");
const fs = require("fs");
// import mapping json using JSON.parse to preserve object key order
const mapping = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, "./mapping.json"), "utf-8")
);
const Message = require("../message");

const eventNameMap = {
  s: "Successful Login",
  ss: "Successful Signup",
  f: "Failed Login"
};

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
      responses.push(processEvent(event));
    } catch (error) {
      responses.push({
        statusCode: 400,
        error: error.message || "Unknwon error"
      });
    }
  });
  return responses;
}

exports.process = process;
