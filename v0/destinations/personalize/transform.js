const _ = require("lodash");
const { KEY_CHECK_LIST } = require("./config");
const {
  isDefinedAndNotNull,
  getHashFromArray,
  getFieldValueFromMessage
} = require("../../util");

async function process(ev) {
  const { destination, message } = ev;
  const { properties, anonymousId, event } = message;
  const { customMappings, trackingId } = destination.Config;

  if (!event) {
    throw new Error(" Cannot process if no event name specified");
  }

  // itemId is a mandatory field, so even if user doesn't mention, it is needed to be provided
  const keyMap = getHashFromArray(customMappings, "from", "to", false);

  // process event properties
  const outputEvent = {
    eventType: event,
    sentAt: getFieldValueFromMessage(message, "historicalTimestamp"),
    properties: {}
  };
  Object.keys(keyMap).forEach(key => {
    // name of the key in event.properties
    const value = properties && properties[keyMap[key]];

    if (!KEY_CHECK_LIST.includes(key.toUpperCase())) {
      if (!isDefinedAndNotNull(value)) {
        throw new Error(`Mapped Field ${keyMap[key]} not found`);
      }

      outputEvent.properties[_.camelCase(key)] = value;
    } else if (
      !(key.toUpperCase() === "USER_ID" || key.toUpperCase() === "EVENT_TYPE")
    ) {
      outputEvent[_.camelCase(key)] = value;
    }
  });

  // manipulate for itemId
  outputEvent.itemId = outputEvent.itemId
    ? outputEvent.itemId
    : message.messageId;

  // userId is a mandatory field, so even if user doesn't mention, it is needed to be provided
  const userId = getFieldValueFromMessage(message, "userIdOnly");

  return {
    userId:
      keyMap.USER_ID && isDefinedAndNotNull(properties[keyMap.USER_ID])
        ? properties[keyMap.USER_ID]
        : userId,
    // not using getFieldValueFromMessage(message, "userId") as we want to
    // prioritize anonymousId over userId
    sessionId: anonymousId || userId,
    trackingId,
    eventList: [outputEvent]
  };
}

exports.process = process;
