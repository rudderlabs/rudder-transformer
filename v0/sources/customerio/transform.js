const Message = require("../message");

const mapping = require("./mapping.json");

const eventNameMap = {
  clicked: "Email Link Clicked",
  opened: "Email Opened",
  bounced: "Email Bounced",
  delivered: "Email Delivered",
  spammed: "Email Spammed",
  unsubscribed: "Email Unsubscribed"
};

function process(event) {
  // support only email status events
  if (event.object_type != "email") {
    return { error: "Only email status events are supported" };
  }

  const message = new Message(`Customer.io`);

  // since only email status events are supported, event type is always track
  eventType = "track";
  message.setEventType(eventType);

  eventName = eventNameMap[event.metric];
  if (!eventName) {
    return { error: "Metric not supported" };
  }
  message.setEventName(eventName);

  message.setProperties(event, mapping);

  if (event.timestamp) {
    message.setProperty(
      "originalTimestamp",
      new Date(event.timestamp * 1000).toISOString()
    );
  }

  return { message };
}

exports.process = process;
