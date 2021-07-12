const _ = require("lodash");
const { KEY_CHECK_LIST, MANDATORY_PROPERTIES } = require("./config");
const {
  isDefinedAndNotNull,
  getHashFromArray,
  getFieldValueFromMessage,
  isBlank,
  isDefined,
  getSuccessRespEvents,
  getErrorRespEvents,
  CustomError
} = require("../../util");

async function process(ev) {
  const { destination, message } = ev;
  const { properties, anonymousId, event } = message;
  const { customMappings, trackingId } = destination.Config;

  if (!event) {
    throw new CustomError(" Cannot process if no event name specified", 400);
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

    if (
      !KEY_CHECK_LIST.includes(key.toUpperCase()) &&
      !MANDATORY_PROPERTIES.includes(key.toUpperCase())
    ) {
      if (!isDefined(value)) {
        throw new CustomError(`Mapped property ${keyMap[key]} not found`, 400);
      }
      // all the values inside property has to be sent as strings
      outputEvent.properties[_.camelCase(key)] = String(value);
    } else if (!MANDATORY_PROPERTIES.includes(key.toUpperCase())) {
      if (
        (!isDefinedAndNotNull(value) || isBlank(value)) &&
        key.toUpperCase() !== "ITEM_ID"
      ) {
        throw new CustomError(
          `Null values cannot be sent for ${keyMap[key]} `,
          400
        );
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
      } else throw new CustomError(" EVENT_VALUE should be a float value", 400);
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

const processRouterDest = async inputs => {
  if (!Array.isArray(inputs) || inputs.length <= 0) {
    const respEvents = getErrorRespEvents(null, 400, "Invalid event array");
    return [respEvents];
  }

  const respList = await Promise.all(
    inputs.map(async input => {
      try {
        if (input.message.statusCode) {
          // already transformed event
          return getSuccessRespEvents(
            input.message,
            [input.metadata],
            input.destination
          );
        }
        // if not transformed
        return getSuccessRespEvents(
          await process(input),
          [input.metadata],
          input.destination
        );
      } catch (error) {
        return getErrorRespEvents(
          [input.metadata],
          error.response
            ? error.response.status
            : error.code
            ? error.code
            : 400,
          error.message || "Error occurred while processing payload."
        );
      }
    })
  );
  return respList;
};

module.exports = { process, processRouterDest };
