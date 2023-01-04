const Message = require("../message");
const { generateUUID } = require("../../util");
const trackMapping = require("./data/trackMapping.json");
const eventNameMap = require("./data/eventMapping.json");

const prepareTrackPayload = event => {
  const message = new Message("PagerDuty");
  message.setEventType("track");
  const eventType = event.event_type;
  const eventName = eventNameMap[eventType] || eventType;
  message.setEventName(eventName);
  message.setPropertiesV2(event, trackMapping);

  // Updating timestamp to acceptable timestamp format ["2017-09-01T09:16:17Z" -> "2017-09-01T09:16:17.000Z"]
  if (message.originalTimestamp) {
    const date = `${Math.floor(
      new Date(message.originalTimestamp).getTime() / 1000
    )}`;
    message.originalTimestamp = new Date(date * 1000).toISOString();
  }

  // setting anonymousId
  if (!message.userId) {
    message.anonymousId = generateUUID();
  }

  return message;
};

function process(event) {
  const { event: processEvent } = event;
  return prepareTrackPayload(processEvent);
}

exports.process = process;
