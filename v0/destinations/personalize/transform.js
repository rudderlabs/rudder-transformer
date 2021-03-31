const _ = require("lodash");
const { KEY_CHECK_LIST, MANDATORY_PROPERTIES } = require("./config");
const {
  isDefinedAndNotNull,
  getHashFromArray,
  getFieldValueFromMessage,
  isBlank,
  isDefined
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
      if (!isDefined(value)) {
        throw new Error(`Mapped property ${keyMap[key]} not found`);
      }
      // all the values inside property has to be sent as strings
      outputEvent.properties[_.camelCase(key)] = String(value);
    } else if (!MANDATORY_PROPERTIES.includes(key.toUpperCase())) {
      if (
        (!isDefinedAndNotNull(value) || isBlank(value)) &&
        key.toUpperCase() !== "ITEM_ID"
      ) {
        throw new Error(`Null values cannot be sent for ${keyMap[key]} `);
      }
      if (
        !(
          key.toUpperCase() === "IMPRESSION" ||
          key.toUpperCase() === "EVENT_VALUE"
        )
      )
        outputEvent[_.camelCase(key)] = String(value);
      else if (key.toUpperCase() === "IMPRESSION") {
        outputEvent[_.camelCase(key)] = Array.isArray(value)
          ? value.map(String)
          : [String(value)];
        outputEvent[_.camelCase(key)] = _.without(
          outputEvent[_.camelCase(key)],
          undefined,
          null,
          ""
        );
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
