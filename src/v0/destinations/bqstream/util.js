/* eslint-disable no-param-reassign */
const { isDefinedAndNotNull } = require('../../util');
/**
 * Optimizes the error response by merging the metadata of the same error type and adding it to the result array.
 *
 * @param {Object} item - An object representing an error event with properties like `error`, `jobId`, and `metadata`.
 * @param {Map} errorMap - A Map object to store the error events and their metadata.
 * @param {Array} resultArray - An array to store the optimized error response.
 * @returns {void}
 */
const optimizeErrorResponse = (item, errorMap, resultArray) => {
  const currentError = item.error;
  if (errorMap.has(currentError)) {
    // If the error already exists in the map, merge the metadata
    const existingErrDetails = errorMap.get(currentError);
    existingErrDetails.metadata.push(...item.metadata);
  } else {
    // Otherwise, add it to the map
    errorMap.set(currentError, { ...item });
    resultArray.push([errorMap.get(currentError)]);
  }
};

const convertMetadataToArray = (eventList) => {
  const processedEvents = eventList.map((event) => ({
    ...event,
    metadata: Array.isArray(event.metadata) ? event.metadata : [event.metadata],
  }));
  return processedEvents;
};

/**
 * Formats a list of error events into a composite response.
 *
 * @param {Array} errorEvents - A list of error events, where each event can have an `error` property and a `metadata` array.
 * @returns {Array} The formatted composite response, where each element is an array containing the error details.
 */
const formatCompositeResponse = (errorEvents) => {
  const resultArray = [];
  const errorMap = new Map();

  for (const item of errorEvents) {
    if (isDefinedAndNotNull(item.error)) {
      optimizeErrorResponse(item, errorMap, resultArray);
    }
  }
  return resultArray;
};

/**
 * Rearranges the events based on their success or error status.
 * If there are no successful events, it groups error events with the same error and their metadata.
 * If there are successful events, it returns the batched response of successful events.
 *
 * @param {Array} successEventList - An array of objects representing successful events.
 * Each object should have an `id` and `metadata` property.
 * @param {Array} errorEventList - An array of objects representing error events.
 * Each object should have an `id`, `metadata`, and `error` property.
 * @returns {Array} - An array of rearranged events.
 */
const getRearrangedEvents = (successEventList, errorEventList) => {
  // Convert 'metadata' to an array if it's not already
  const processedSuccessfulEvents = convertMetadataToArray(successEventList);
  const processedErrorEvents = convertMetadataToArray(errorEventList);

  // if there are no error events, then return the batched response
  if (errorEventList.length === 0) {
    return [processedSuccessfulEvents];
  }
  // if there are no batched response, then return the error events
  if (successEventList.length === 0) {
    return formatCompositeResponse(processedErrorEvents);
  }

  // if there are both batched response and error events, then order them
  const combinedTransformedEventList = [
    [...processedSuccessfulEvents],
    ...formatCompositeResponse(processedErrorEvents),
  ];
  return combinedTransformedEventList;
};

module.exports = { getRearrangedEvents };
