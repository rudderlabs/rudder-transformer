const path = require("path");
const fs = require("fs");
// import mapping json using JSON.parse to preserve object key order
const mapping = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, "./mapping.json"), "utf-8")
);
const Message = require("../message");

const eventNameMap = {
  clicked: "Email Link Clicked",
  opened: "Email Opened",
  bounced: "Email Bounced",
  delivered: "Email Delivered",
  spammed: "Email Marked as Spam",
  unsubscribed: "Email Unsubscribed"
};

function process(event) {
  // support only email status events
  if (event.object_type !== "email") {
    throw new Error("Only email status events are supported");
  }

  const message = new Message(`Customer.io`);

  // since only email status events are supported, event type is always track
  const eventType = "track";
  message.setEventType(eventType);

  const eventName = eventNameMap[event.metric];
  if (!eventName) {
    throw new Error("Metric not supported");
  }
  message.setEventName(eventName);

  message.setProperties(event, mapping);

  if (event.timestamp) {
    const ts = new Date(event.timestamp * 1000).toISOString();
    message.setProperty("originalTimestamp", ts);
    message.setProperty("sentAt", ts);
  }

  // when customer.io does not pass an associated userId, set the email address as anonymousId
  if (message.userId === null || message.userId === undefined) {
    if (
      message.context &&
      message.context.traits &&
      message.context.traits.email
    ) {
      message.anonymousId = message.context.traits.email;
    }
  }

  return message;
}

exports.process = process;
