const _ = require("lodash");
const { KEY_CHECK_LIST, MANDATORY_PROPERTIES } = require("./config");
const { EventType } = require("../../../constants");
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

const putEventsHandler = (message, destination) => {
  const { properties, anonymousId, event } = message;
  const { customMappings, trackingId } = destination.Config;

  if (!trackingId) {
    throw new CustomError(
      "Tracking Id is a mandatory information to use putUsers"
    );
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
  const response = {
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

  return response;
};

const putItemsHandler = (message, destination) => {
  const { properties } = message;
  const { customMappings, datasetARN } = destination.Config;
  const keyMap = getHashFromArray(customMappings, "from", "to", false);

  if (!datasetARN) {
    throw new CustomError(
      "Dataset ARN is a mandatory information to use putUsers"
    );
  }
  if (
    !datasetARN.startsWith("arn:") &&
    !datasetARN.includes(":personalize:") &&
    !datasetARN.includes("/ITEMS") // should we do endswith here?
  ) {
    throw new CustomError(
      "Either Dataset ARN is not correctly entered or invalid",
      400
    );
  }
  const outputItem = {
    properties: {}
  };
  Object.keys(keyMap).forEach(key => {
    let value;

    if (key.toUpperCase() !== "ITEM_ID") {
      value = properties && properties[keyMap[key]];
    } else {
      value = String(_.get(message, keyMap[key]));
    }
    if (!isDefined(value)) {
      throw new CustomError(`Mapped property ${keyMap[key]} not found`, 400);
    }
    if (key.toUpperCase() !== "ITEM_ID") {
      // itemId is not allowed inside properties
      outputItem.properties[_.camelCase(key)] = String(value);
    } else {
      outputItem.itemId = String(value);
    }
  });
  if (!outputItem.itemId) {
    throw new CustomError(
      "itemId is a mandatory property for using PutItems",
      400
    );
  }
  const response = {
    datasetArn: datasetARN,
    items: [outputItem]
  };
  return response;
};

const trackRequestHandler = async (message, destination) => {
  let response;
  const { event } = message;
  const { eventChoice } = destination.Config;
  if (!event) {
    throw new CustomError(" Cannot process if no event name specified", 400);
  }
  switch (eventChoice) {
    case "PutEvents":
      response = putEventsHandler(message, destination);
      break;
    case "PutItems":
      response = putItemsHandler(message, destination);
      break;
    default:
      throw new CustomError(
        `${eventChoice} is not supported for Track Calls`,
        400
      );
  }
  return response;
};

const identifyRequestHandler = (message, destination) => {
  const { traits } = message;
  const { customMappings, datasetARN, eventChoice } = destination.Config;
  const keyMap = getHashFromArray(customMappings, "from", "to", false);

  if (eventChoice !== "PutUsers") {
    throw new CustomError(
      `This Message Type does not support ${eventChoice}. Aborting message.",
    400`
    );
  }

  if (!datasetARN) {
    throw new CustomError(
      "Dataset ARN is a mandatory information to use putUsers"
    );
  }

  if (
    !datasetARN.startsWith("arn:") &&
    !datasetARN.includes(":personalize:") &&
    !datasetARN.includes("/USERS") // should we do endswith here?
  ) {
    throw new CustomError(
      "Either Dataset ARN is not correctly entered or invalid.",
      400
    );
  }

  const outputUser = {
    userId: getFieldValueFromMessage(message, "userId"),
    properties: {}
  };
  Object.keys(keyMap).forEach(key => {
    const value = traits && traits[keyMap[key]];

    if (!isDefined(value)) {
      throw new CustomError(`Mapped property ${keyMap[key]} not found`, 400);
    }
    if (key.toUpperCase() !== "USER_ID") {
      // userId is not allowed inside properties
      outputUser.properties[_.camelCase(key)] = String(value);
    }
  });
  if (!outputUser.userId) {
    throw new CustomError(
      "userId is a mandatory property for using PutUsers",
      400
    );
  }
  const response = {
    datasetArn: datasetARN,
    users: [outputUser]
  };
  return response;
};

const processEvent = async (message, destination) => {
  let response;
  const { eventChoice } = destination.Config;
  if (!message.type) {
    throw new CustomError(
      "Message Type is not present. Aborting message.",
      400
    );
  }

  const messageType = message.type.toLowerCase();
  switch (messageType) {
    case EventType.IDENTIFY:
      response = await identifyRequestHandler(message, destination);
      break;
    case EventType.TRACK:
      response = await trackRequestHandler(message, destination);
      break;
    default:
      throw new CustomError("Message type not supported", 400);
  }
  const wrappedResponse = {
    payload: response,
    choice: eventChoice
  };
  return wrappedResponse;
};

const process = event => {
  return processEvent(event.message, event.destination);
};

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
          // eslint-disable-next-line no-nested-ternary
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
