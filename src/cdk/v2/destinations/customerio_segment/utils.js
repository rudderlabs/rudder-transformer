const {
  MappedToDestinationKey,
  ConfigurationError,
  isDefinedAndNotNullAndNotEmpty,
} = require('@rudderstack/integrations-lib');
const get = require('get-value');
const {
  getDestinationExternalIDInfoForRetl,
  getSuccessRespEvents,
} = require('../../../../v0/util');

const deduceSegmentInfo = (inputs) => {
  const singleRecordInput = inputs[0].message;
  const segmentInfo = {};
  const mappedToDestination = get(singleRecordInput, MappedToDestinationKey);
  if (mappedToDestination) {
    const { identifierType, objectType } = getDestinationExternalIDInfoForRetl(
      singleRecordInput,
      'CUSTOMERIO_SEGMENT',
    );
    if (!isDefinedAndNotNullAndNotEmpty(objectType)) {
      throw new ConfigurationError('Segment ID is a mandatory field');
    }
    segmentInfo.segmentId = objectType;
    segmentInfo.identifierType = identifierType;
  }
  return segmentInfo;
};

/**
 * Generates a Basic Authentication header for Customer.io Track API
 * @param {Object} config - The configuration object containing siteId and apiKey
 * @returns {string} - The Basic Authentication header value
 */
const generateBasicAuthHeader = (config) => {
  const { siteId, apiKey } = config;
  if (!siteId || !apiKey) {
    throw new ConfigurationError('Site ID and API Key are required for Customer.io segment');
  }
  const credentials = `${siteId}:${apiKey}`;
  return `Basic ${Buffer.from(credentials).toString('base64')}`;
};

/**
 * Handles both upsert and deletion operations for a specific input.
 *
 * @param {Object} input - The input data for the operation.
 * @param {Object} fields - The fields to be processed.
 * @param {string} action - The action to be performed ('insert', 'update', or 'delete').
 * @param {Object} transformedResponseToBeBatched - The response object to be batched.
 * @param {string} identifierType - The type of identifier used.
 */
const handleOperation = (input, fields, action, transformedResponseToBeBatched, identifierType) => {
  const isUpsert = action === 'insert' || action === 'update';
  const operationType = isUpsert ? 'upsert' : 'deletion';

  transformedResponseToBeBatched[`${operationType}Data`].push([fields[identifierType]]);
  transformedResponseToBeBatched[`${operationType}SuccessMetadata`].push(input.metadata);
};

/**
 * Appends success responses to the main response array.
 *
 * @param {Array} response - The main response array to which success responses will be appended.
 * @param {Array} responseArray - An array of batched responses.
 * @param {Array} metadataChunks - An array containing metadata chunks.
 * @param {string} destination - The destination for the success responses.
 */
const appendSuccessResponses = (response, responseArray, metadataChunks, destination) => {
  responseArray.forEach((batchedResponse, index) => {
    response.push(
      getSuccessRespEvents(batchedResponse, metadataChunks.items[index], destination, true),
    );
  });
};

module.exports = {
  deduceSegmentInfo,
  generateBasicAuthHeader,
  handleOperation,
  appendSuccessResponses,
};
