/* eslint-disable no-nested-ternary */
const get = require('get-value');
const { ConfigurationError } = require('@rudderstack/integrations-lib');
const {
  getValueFromMessage,
  getSuccessRespEvents,
  handleRtTfSingleEventError,
} = require('../../util');

const SOURCE_KEYS = ['properties', 'traits', 'context.traits'];

/**
 *
 * @param {*} message
 * @param {*} sourceKey
 * @param {*} mappingKey
 *
 * here we iterate through free flowing objects inside our events
 * and check for the property value. Property with Whitespace between them
 * is also supported
 */
const getMappingFieldValueFormMessage = (message, sourceKey, mappingKey) => {
  let value;
  const tempStore = getValueFromMessage(message, sourceKey);
  if (tempStore) {
    value = tempStore[mappingKey] || get(tempStore, mappingKey);
  }
  return value;
};

/**
 *
 * @param {*} message
 * @param {*} attributeKeyMapping
 *
 * Here we process the event based on the custom mapping
 * (attributeKeyMapping) we get from the destination-definition.
 * As `attributeKeyMapping` is an array of mapping hence we
 * dont loose the order of the mapping.
 *
 * Returns a json with numbered mapping keys denoting the position
 * where the value needs to be placed when pared into array in server.
 */
const processWithCustomMapping = (message, attributeKeyMapping) => {
  const responseMessage = {};
  const fromKey = 'from';
  const toKey = 'to';
  let count = 0;

  // Adding messageId in the first column to maintain order when whenver
  // we are getting blank-values. We need to append below non-empty Value
  // expecting messageId never to be empty.
  // If messageId not present should add UUID?

  responseMessage[count] = {
    attributeKey: 'messageId',
    attributeValue: message.messageId || '',
  };
  count += 1;

  if (Array.isArray(attributeKeyMapping)) {
    attributeKeyMapping.forEach((mapping) => {
      let value;
      // Check in root-level
      value = getValueFromMessage(message, mapping[fromKey]);
      if (!value) {
        // Check in free-flowing object level
        SOURCE_KEYS.some((sourceKey) => {
          value = getMappingFieldValueFormMessage(message, sourceKey, mapping[fromKey]);
          return !!value;
        });
      }
      // Set the value if present else set an empty string
      responseMessage[count] = {
        attributeKey: mapping[toKey],
        attributeValue: value || '',
      };
      count += 1;
    });
  }
  return responseMessage;
};

const batch = (events) => ({ batch: events });

// Function for transforming single payload
const processSingleMessage = (event) => {
  const { message, destination } = event;
  if (destination.Config.sheetName) {
    const payload = {
      message: processWithCustomMapping(message, destination.Config.eventKeyMap),
    };
    return payload;
  }
  throw new ConfigurationError('No Spread Sheet set for this event');
};

// Main process Function to handle transformation
// Server expects the message to be wrapped in batch attribute,
// hence the payload is wrapped and returned using this function
const process = (event) => {
  const payload = processSingleMessage(event);
  const batchedResponse = batch(payload);
  batchedResponse.spreadSheetId = event.destination.Config.sheetId;
  batchedResponse.spreadSheet = event.destination.Config.sheetName;
  return batchedResponse;
};

// Router transform with batching by default
const processRouterDest = async (inputs, reqMetadata) => {
  const successRespList = [];
  const errorRespList = [];
  const successMetadata = [];

  await Promise.all(
    inputs.map(async (input) => {
      try {
        if (input.message.statusCode) {
          // already transformed event
          successRespList.push(input.message);
          successMetadata.push(input.metadata);
        } else {
          // if not transformed
          successRespList.push(processSingleMessage(input));
          successMetadata.push(input.metadata);
        }
      } catch (error) {
        const errRespEvent = handleRtTfSingleEventError(input, error, reqMetadata);
        errorRespList.push(errRespEvent);
      }
    }),
  );

  const responses = [];

  // Only create success response if there are successful events
  if (successRespList.length > 0) {
    const batchedResponse = batch(successRespList);
    batchedResponse.spreadSheetId = inputs[0].destination.Config.sheetId;
    batchedResponse.spreadSheet = inputs[0].destination.Config.sheetName;

    responses.push(
      getSuccessRespEvents(batchedResponse, successMetadata, inputs[0].destination, true),
    );
  }

  return [...responses, ...errorRespList];
};

module.exports = { process, processRouterDest };
