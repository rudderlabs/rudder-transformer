const get = require("get-value");
const { EventType } = require("../../../constants");
const {
  CustomError,
  checkInvalidRtTfEvents,
  handleRtTfSingleEventError,
  getDestinationExternalIDInfoForRetl
} = require("../../util");
const { API_VERSION } = require("./config");
const {
  processLegacyIdentify,
  processLegacyTrack,
  legacyBatchEvents
} = require("./HSTransform-v1");
const {
  MappedToDestinationKey,
  GENERIC_TRUE_VALUES
} = require("../../../constants");
const {
  processIdentify,
  processTrack,
  batchEvents
} = require("./HSTransform-v2");
const {
  splitEventsForCreateUpdate,
  fetchFinalSetOfTraits,
  getProperties,
  validateDestinationConfig
} = require("./util");

const processSingleMessage = async (message, destination, propertyMap) => {
  if (!message.type) {
    throw new CustomError(
      "Message type is not present. Aborting message.",
      400
    );
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
        response.push(
          await processLegacyIdentify(message, destination, propertyMap)
        );
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
      throw new CustomError(
        `Message type ${message.type} is not supported`,
        400
      );
  }

  return response;
};

// has been deprecated - using routerTransform for both the versions
const process = async event => {
  const { destination } = event;
  const mappedToDestination = get(event.message, MappedToDestinationKey);
  let events = [];
  events = [event];
  if (
    mappedToDestination &&
    GENERIC_TRUE_VALUES.includes(mappedToDestination?.toString())
  ) {
    // get info about existing objects and splitting accordingly.
    events = await splitEventsForCreateUpdate([event], destination);
  }
  return processSingleMessage(events[0].message, events[0].destination);
};

// we are batching by default at routerTransform
const processRouterDest = async inputs => {
  const errorRespEvents = checkInvalidRtTfEvents(inputs, "HS");
  if (errorRespEvents.length > 0) {
    return errorRespEvents;
  }
  const successRespList = [];
  const errorRespList = [];
  // using the first destination config for transforming the batch
  const { destination } = inputs[0];
  let propertyMap;
  const mappedToDestination = get(inputs[0].message, MappedToDestinationKey);
  const { objectType } = getDestinationExternalIDInfoForRetl(
    inputs[0].message,
    "HS"
  );
  if (
    mappedToDestination &&
    GENERIC_TRUE_VALUES.includes(mappedToDestination?.toString())
  ) {
    // skip splitting the batches to inserts and updates if object it is an association
    if (objectType.toLowerCase() !== "association") {
      // get info about existing objects and splitting accordingly.
      inputs = await splitEventsForCreateUpdate(inputs, destination);
    }
  } else {
    // reduce the no. of calls for properties endpoint
    const traitsFound = inputs.some(input => {
      return fetchFinalSetOfTraits(input.message) !== undefined;
    });
    if (traitsFound) {
      propertyMap = await getProperties(destination);
    }
  }

  await Promise.all(
    inputs.map(async input => {
      try {
        if (input.message.statusCode) {
          // already transformed event
          successRespList.push({
            message: input.message,
            metadata: input.metadata,
            destination
          });
        } else {
          // event is not transformed
          let receivedResponse = await processSingleMessage(
            input.message,
            destination,
            propertyMap
          );

          receivedResponse = Array.isArray(receivedResponse)
            ? receivedResponse
            : [receivedResponse];

          // received response can be in array format [{}, {}, {}, ..., {}]
          // if multiple response is being returned
          receivedResponse.forEach(element => {
            successRespList.push({
              message: element,
              metadata: input.metadata,
              destination
            });
          });
        }
      } catch (error) {
        const errRespEvent = handleRtTfSingleEventError(input, error, "HS");
        errorRespList.push(errRespEvent);
      }
    })
  );

  // batch implementation
  let batchedResponseList = [];
  if (successRespList.length) {
    if (destination.Config.apiVersion === API_VERSION.v3) {
      batchedResponseList = batchEvents(successRespList);
    } else {
      batchedResponseList = legacyBatchEvents(successRespList);
    }
  }
  return [...batchedResponseList, ...errorRespList];
};

module.exports = { process, processRouterDest };
