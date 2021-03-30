const _ = require("lodash");
const { KEY_CHECK_LIST } = require("./config");
const {
  isDefinedAndNotNull,
  getHashFromArray,
  getFieldValueFromMessage,
  isBlank,
  checkEmptyStringInarray
} = require("../../util");

async function process(ev) {
  const { destination, message } = ev;
  const { properties, anonymousId, event } = message;
  const { customMappings, trackingId } = destination.Config;

  if (!event) {
    throw new Error(" Cannot process if no event name specified");
  }

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
      // all the values inside property has to be sent as strings
      outputEvent.properties[_.camelCase(key)] =
        String(value) === "" || String(value) === " "
          ? "undefined"
          : String(value);
    } else if (
      !(
        key.toUpperCase() === "USER_ID" ||
        key.toUpperCase() === "EVENT_TYPE" ||
        key.toUpperCase() === "TIMESTAMP"
      )
    ) {
      if (
        !(
          key.toUpperCase() === "IMPRESSION" ||
          key.toUpperCase() === "EVENT_VALUE"
        )
      )
        outputEvent[_.camelCase(key)] =
          String(value) === "" ? " " : String(value);
      else if (key.toUpperCase() === "IMPRESSION") {
        outputEvent[_.camelCase(key)] = Array.isArray(value)
          ? value.map(String)
          : [String(value) === "" ? " " : String(value)];
        if (!checkEmptyStringInarray(outputEvent[_.camelCase(key)]))
          throw new Error(" You cannot parse empty string through impression");
      } else if (!Number.isNaN(parseFloat(value))) {
        // for eventValue
        outputEvent[_.camelCase(key)] = parseFloat(value);
      } else throw new Error(" EVENT_VALUE should be a float value");
    }
  });

  // manipulate for itemId
  outputEvent.itemId =
    outputEvent.itemId &&
    outputEvent.itemId !== "undefined" &&
    outputEvent.itemId !== " "
      ? outputEvent.itemId
      : message.messageId;

  // userId is a mandatory field, so even if user doesn't mention, it is needed to be provided
  const userId = getFieldValueFromMessage(message, "userIdOnly");

  return {
    userId:
      keyMap.USER_ID &&
      isDefinedAndNotNull(properties[keyMap.USER_ID]) &&
      !isBlank(properties[keyMap.USER_ID]) &&
      properties[keyMap.USER_ID] !== " "
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
