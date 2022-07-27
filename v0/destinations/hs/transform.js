/* eslint-disable import/no-unresolved */
const get = require("get-value");
const { EventType } = require("../../../constants");
const { getErrorRespEvents, CustomError } = require("../../util");
const {
  processLegacyIdentify,
  processLegacyTrack,
  legacyBatchEvents
} = require("./HSTransform-v1");
const { MappedToDestinationKey } = require("../../../constants");
const {
  processIdentify,
  processTrack,
  batchEvents
} = require("./HSTransform-v2");
const {
  getTraits,
  getProperties,
  splitEventsForCreateUpdate
} = require("./util");

const processSingleMessage = async (message, destination, propertyMap) => {
  if (!message.type) {
    throw new CustomError(
      "Message type is not present. Aborting message.",
      400
    );
  }

  let response;
  switch (message.type) {
    case EventType.IDENTIFY: {
      response = [];
      if (destination.Config.apiVersion === "newApi") {
        response.push(await processIdentify(message, destination, propertyMap));
      } else {
        response.push(
          await processLegacyIdentify(message, destination, propertyMap)
        );
      }

      // handle CRM Association v3
      // const traits = getFieldValueFromMessage(message, "traits");
      // if (traits.hubspot) {
      //   response.push(
      //     await processCRMCustomObjects(message, destination, traits)
      //   );
      // }
      break;
    }
    case EventType.TRACK:
      if (destination.Config.apiVersion === "newApi") {
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
const process = event => {
  return processSingleMessage(event.message, event.destination);
};

// we are batching by default at routerTransform
const processRouterDest = async inputs => {
  if (!Array.isArray(inputs) || inputs.length <= 0) {
    const respEvents = getErrorRespEvents(null, 400, "Invalid event array");
    return [respEvents];
  }
  const successRespList = [];
  const errorRespList = [];
  // using the first destination config for transforming the batch
  const { destination } = inputs[0];
  let propertyMap;
  const mappedToDestination = get(inputs[0].message, MappedToDestinationKey);
  if (mappedToDestination) {
    inputs = await splitEventsForCreateUpdate(inputs, destination);
  } else {
    // reduce the no. of calls for properties endpoint
    const traitsFound = inputs.some(input => {
      return getTraits(input.message) !== undefined;
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
        errorRespList.push(
          getErrorRespEvents(
            [input.metadata],
            error.response ? error.response.status : 400,
            error.message || "Error occurred while processing payload."
          )
        );
      }
    })
  );

  // batch implementation
  let batchedResponseList = [];
  if (successRespList.length) {
    if (destination.Config.apiVersion === "newApi") {
      batchedResponseList = batchEvents(successRespList);
    } else {
      batchedResponseList = legacyBatchEvents(successRespList);
    }
  }
  return [...batchedResponseList, ...errorRespList];
};

module.exports = { process, processRouterDest };
