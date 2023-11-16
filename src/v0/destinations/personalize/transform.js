const lodash = require('lodash');
const { ConfigurationError, InstrumentationError } = require('@rudderstack/integrations-lib');
const { KEY_CHECK_LIST, MANDATORY_PROPERTIES } = require('./config');
const { EventType } = require('../../../constants');
const {
  isDefinedAndNotNull,
  getHashFromArray,
  getFieldValueFromMessage,
  isBlank,
  isDefined,
  simpleProcessRouterDest,
} = require('../../util');

const putEventsHandler = (message, destination) => {
  const { properties, anonymousId, event, messageId, context } = message;
  const { customMappings, trackingId, disableStringify } = destination.Config;

  if (!event || !isDefinedAndNotNull(event) || isBlank(event)) {
    throw new InstrumentationError('Cannot process if no event name specified');
  }

  if (!trackingId) {
    throw new ConfigurationError('Tracking Id is a mandatory information to use putEvents');
  }

  const keyMap = getHashFromArray(customMappings, 'from', 'to', false);

  // process event properties
  const outputEvent = {
    eventType: event,
    sentAt: getFieldValueFromMessage(message, 'historicalTimestamp'),
    properties: {},
  };
  Object.keys(keyMap).forEach((key) => {
    // name of the key in event.properties
    const value = properties && properties[keyMap[key]];
    if (
      !KEY_CHECK_LIST.includes(key.toUpperCase()) &&
      !MANDATORY_PROPERTIES.includes(key.toUpperCase())
    ) {
      if (!isDefined(value)) {
        throw new InstrumentationError(`Mapped property ${keyMap[key]} not found`);
      }
      if (isDefined(disableStringify) && disableStringify) {
        outputEvent.properties[lodash.camelCase(key)] = value;
      } else {
        // users using old config will have stringified property by default
        outputEvent.properties[lodash.camelCase(key)] = String(value);
      }
    } else if (!MANDATORY_PROPERTIES.includes(key.toUpperCase())) {
      if ((!isDefinedAndNotNull(value) || isBlank(value)) && key.toUpperCase() !== 'ITEM_ID') {
        throw new InstrumentationError(`Null values cannot be sent for ${keyMap[key]} `);
      }
      if (!(key.toUpperCase() === 'IMPRESSION' || key.toUpperCase() === 'EVENT_VALUE'))
        outputEvent[lodash.camelCase(key)] = String(value);
      else if (key.toUpperCase() === 'IMPRESSION') {
        outputEvent[lodash.camelCase(key)] = Array.isArray(value)
          ? value.map(String)
          : [String(value)];
        outputEvent[lodash.camelCase(key)] = lodash.without(
          outputEvent[lodash.camelCase(key)],
          undefined,
          null,
          '',
        );
      } else if (!Number.isNaN(parseFloat(value))) {
        // for eventValue
        outputEvent[lodash.camelCase(key)] = parseFloat(value);
      } else throw new InstrumentationError('EVENT_VALUE should be a float value');
    }
  });
  // manipulate for itemId
  outputEvent.itemId =
    outputEvent.itemId && outputEvent.itemId !== 'undefined' && outputEvent.itemId !== ' '
      ? outputEvent.itemId
      : messageId;
  // userId is a mandatory field, so even if user doesn't mention, it is needed to be provided
  const userId = getFieldValueFromMessage(message, 'userIdOnly');
  const response = {
    userId:
      keyMap.USER_ID &&
      isDefinedAndNotNull(properties[keyMap.USER_ID]) &&
      !isBlank(properties[keyMap.USER_ID]) &&
      properties[keyMap.USER_ID] !== ' '
        ? properties[keyMap.USER_ID]
        : userId,
    // not using getFieldValueFromMessage(message, "userId") as we want to
    // prioritize anonymousId over userId
    sessionId: anonymousId || userId || context?.sessionId,
    trackingId,
    eventList: [outputEvent],
  };

  return response;
};

const putItemsHandler = (message, destination) => {
  const { properties } = message;
  const { customMappings, datasetARN } = destination.Config;
  const keyMap = getHashFromArray(customMappings, 'from', 'to', false);

  if (!datasetARN) {
    throw new ConfigurationError('Dataset ARN is a mandatory information to use putItems');
  }
  if (!datasetARN.includes('/ITEMS')) {
    throw new ConfigurationError('Either Dataset ARN is not correctly entered or invalid');
  }
  const outputItem = {
    properties: {},
  };
  Object.keys(keyMap).forEach((key) => {
    let value;

    if (key.toUpperCase() !== 'ITEM_ID') {
      value = properties && properties[keyMap[key]];
    } else {
      // eslint-disable-next-line no-lonely-if
      if (!isDefinedAndNotNull(value) || isBlank(value)) {
        // itemId cannot be null
        value = String(lodash.get(message, keyMap[key]));
      }
    }
    if (!isDefined(value)) {
      throw new InstrumentationError(`Mapped property ${keyMap[key]} not found`);
    }
    if (key.toUpperCase() !== 'ITEM_ID') {
      // itemId is not allowed inside properties
      outputItem.properties[lodash.camelCase(key)] = value;
    } else {
      outputItem.itemId = String(value);
    }
  });
  if (!outputItem.itemId) {
    throw new InstrumentationError('itemId is a mandatory property for using PutItems');
  }
  const response = {
    datasetArn: datasetARN,
    items: [outputItem],
  };
  return response;
};

const trackRequestHandler = (message, destination, eventOperation) => {
  let response;

  switch (eventOperation) {
    case 'PutEvents':
      response = putEventsHandler(message, destination);
      break;
    case 'PutItems':
      response = putItemsHandler(message, destination);
      break;
    default:
      throw new ConfigurationError(`${eventOperation} is not supported for Track Calls`);
  }
  return response;
};

const identifyRequestHandler = (message, destination, eventOperation) => {
  const traits = getFieldValueFromMessage(message, 'traits');
  const { customMappings, datasetARN } = destination.Config;

  const keyMap = getHashFromArray(customMappings, 'from', 'to', false);

  if (eventOperation !== 'PutUsers') {
    throw new ConfigurationError(
      `This Message Type does not support ${eventOperation}. Aborting message`,
    );
  }

  if (!datasetARN) {
    throw new ConfigurationError('Dataset ARN is a mandatory information to use putUsers');
  }

  if (!datasetARN.includes('/USERS')) {
    throw new ConfigurationError('Either Dataset ARN is not correctly entered or invalid');
  }

  const outputUser = {
    userId: getFieldValueFromMessage(message, 'userId'),
    properties: {},
  };
  Object.keys(keyMap).forEach((key) => {
    const value = traits && traits[keyMap[key]];
    if (!isDefined(value)) {
      throw new InstrumentationError(`Mapped property ${keyMap[key]} not found`);
    }
    if (key.toUpperCase() !== 'USER_ID') {
      // userId is not allowed inside properties
      outputUser.properties[lodash.camelCase(key)] = value;
    }
  });
  if (!outputUser.userId) {
    throw new InstrumentationError('userId is a mandatory property for using PutUsers');
  }
  const response = {
    datasetArn: datasetARN,
    users: [outputUser],
  };
  return response;
};

const processEvent = async (message, destination) => {
  let response;
  let wrappedResponse;
  const { eventChoice } = destination.Config;
  const eventOperation = eventChoice || 'PutEvents';
  if (!message.type) {
    throw new InstrumentationError('Event type is required');
  }

  const messageType = message.type.toLowerCase();
  switch (messageType) {
    case EventType.IDENTIFY:
      response = identifyRequestHandler(message, destination, eventOperation);
      break;
    case EventType.TRACK:
      response = trackRequestHandler(message, destination, eventOperation);
      break;
    default:
      throw new InstrumentationError(`Event type ${messageType} is not supported`);
  }

  if (eventChoice && eventChoice !== 'PutEvents') {
    wrappedResponse = {
      payload: response,
      choice: eventChoice,
    };
  } else {
    // this is done to make it comaptible with the older version of rudder-server
    wrappedResponse = response;
  }

  return wrappedResponse;
};

const process = (event) => processEvent(event.message, event.destination);

const processRouterDest = async (inputs, reqMetadata) => {
  const respList = await simpleProcessRouterDest(inputs, process, reqMetadata);
  return respList;
};

module.exports = { process, processRouterDest };
