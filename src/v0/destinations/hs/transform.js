const get = require('get-value');
const { InstrumentationError } = require('@rudderstack/integrations-lib');
const { EventType } = require('../../../constants');
const {
  handleRtTfSingleEventError,
  getDestinationExternalIDInfoForRetl,
  groupEventsByType: batchEventsInOrder,
} = require('../../util');
const { API_VERSION } = require('./config');
const {
  processLegacyIdentify,
  processLegacyTrack,
  legacyBatchEvents,
} = require('./HSTransform-v1');
const { MappedToDestinationKey, GENERIC_TRUE_VALUES } = require('../../../constants');
const { processIdentify, processTrack, batchEvents } = require('./HSTransform-v2');
const {
  splitEventsForCreateUpdate,
  fetchFinalSetOfTraits,
  getProperties,
  validateDestinationConfig,
} = require('./util');

const processSingleMessage = async (message, destination, propertyMap) => {
  if (!message.type) {
    throw new InstrumentationError('Message type is not present. Aborting message.');
  }

  // Config Validation
  validateDestinationConfig(destination);

  let response;
  switch (message.type) {
    case EventType.IDENTIFY: {
      response = [];
      if (destination.Config.apiVersion === API_VERSION.v3) {
        response.push(await processIdentify(message, destination, propertyMap));
      } else {
        // Legacy API
        response.push(await processLegacyIdentify(message, destination, propertyMap));
      }
      break;
    }
    case EventType.TRACK:
      if (destination.Config.apiVersion === API_VERSION.v3) {
        response = await processTrack(message, destination, propertyMap);
      } else {
        response = await processLegacyTrack(message, destination, propertyMap);
      }
      break;
    default:
      throw new InstrumentationError(`Message type ${message.type} is not supported`);
  }

  return response;
};

// has been deprecated - using routerTransform for both the versions
const process = async (event) => {
  const { destination, message } = event;
  const mappedToDestination = get(message, MappedToDestinationKey);
  let events = [];
  events = [event];
  if (mappedToDestination && GENERIC_TRUE_VALUES.includes(mappedToDestination?.toString())) {
    // get info about existing objects and splitting accordingly.
    events = await splitEventsForCreateUpdate([event], destination);
  }
  return processSingleMessage(events[0].message, events[0].destination);
};
const processBatchRouter = async (inputs, reqMetadata) => {
  let tempInputs = inputs;
  // using the first destination config for transforming the batch
  const { destination } = tempInputs[0];
  let propertyMap;
  const mappedToDestination = get(tempInputs[0].message, MappedToDestinationKey);
  const { objectType } = getDestinationExternalIDInfoForRetl(tempInputs[0].message, 'HS');
  const successRespList = [];
  const errorRespList = [];
  // batch implementation
  let batchedResponseList = [];
  try {
    if (mappedToDestination && GENERIC_TRUE_VALUES.includes(mappedToDestination?.toString())) {
      // skip splitting the batches to inserts and updates if object it is an association
      if (objectType.toLowerCase() !== 'association') {
        propertyMap = await getProperties(destination);
        // get info about existing objects and splitting accordingly.
        tempInputs = await splitEventsForCreateUpdate(tempInputs, destination);
      }
    } else {
      // reduce the no. of calls for properties endpoint
      const traitsFound = tempInputs.some(
        (input) => fetchFinalSetOfTraits(input.message) !== undefined,
      );
      if (traitsFound) {
        propertyMap = await getProperties(destination);
      }
    }
  } catch (error) {
    // Any error thrown from the above try block applies to all the events
    return {
      batchedResponseList,
      errorRespList: tempInputs.map((input) =>
        handleRtTfSingleEventError(input, error, reqMetadata),
      ),
    };
  }

  await Promise.all(
    inputs.map(async (input) => {
      try {
        if (input.message.statusCode) {
          // already transformed event
          successRespList.push({
            message: input.message,
            metadata: input.metadata,
            destination,
          });
        } else {
          // event is not transformed
          let receivedResponse = await processSingleMessage(
            input.message,
            destination,
            propertyMap,
          );

          receivedResponse = Array.isArray(receivedResponse)
            ? receivedResponse
            : [receivedResponse];

          // received response can be in array format [{}, {}, {}, ..., {}]
          // if multiple response is being returned
          receivedResponse.forEach((element) => {
            successRespList.push({
              message: element,
              metadata: input.metadata,
              destination,
            });
          });
        }
      } catch (error) {
        const errRespEvent = handleRtTfSingleEventError(input, error, reqMetadata);
        errorRespList.push(errRespEvent);
      }
    }),
  );

  if (successRespList.length > 0) {
    if (destination.Config.apiVersion === API_VERSION.v3) {
      batchedResponseList = batchEvents(successRespList);
    } else {
      batchedResponseList = legacyBatchEvents(successRespList);
    }
  }
  return { batchedResponseList, errorRespList };
};
// we are batching by default at routerTransform
const processRouterDest = async (inputs, reqMetadata) => {
  const tempNewInputs = batchEventsInOrder(inputs);
  const batchedResponseList = [];
  const errorRespList = [];
  const promises = tempNewInputs.map(async (inputEvents) => {
    const response = await processBatchRouter(inputEvents, reqMetadata);
    return response;
  });

  const results = await Promise.all(promises);

  results.forEach((response) => {
    errorRespList.push(...response.errorRespList);
    batchedResponseList.push(...response.batchedResponseList);
  });
  return [...batchedResponseList, ...errorRespList];
};

module.exports = { process, processRouterDest };
