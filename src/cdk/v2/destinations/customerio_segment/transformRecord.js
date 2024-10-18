const { InstrumentationError } = require('@rudderstack/integrations-lib');
const { BatchUtils } = require('@rudderstack/workflow-engine');
const {
  defaultPostRequestConfig,
  defaultRequestConfig,
  handleRtTfSingleEventError,
  isEmptyObject,
} = require('../../../../v0/util');
const customerioConfig = require('./config');
const {
  deduceSegmentInfo,
  generateBasicAuthHeader,
  handleOperation,
  appendSuccessResponses,
} = require('./utils');

// Main response builder function
const responseBuilder = (items, config, segmentId, action, identifierType) => {
  const response = {
    ...defaultRequestConfig(),
    headers: {
      Authorization: generateBasicAuthHeader(config),
    },
    method: defaultPostRequestConfig.requestMethod,
    body: {
      JSON: { ids: items },
    },
  };

  response.endpoint = customerioConfig.COMMON_RECORD_ENDPOINT(
    segmentId,
    identifierType,
    action === 'delete' ? 'remove_customers' : undefined,
  );

  return response;
};
const batchResponseBuilder = (
  transformedResponseToBeBatched,
  config,
  identifierType,
  segmentId,
  // upsertEndPoint,
  action,
) => {
  const upsertResponseArray = [];
  const deletionResponseArray = [];
  const { upsertData, deletionData, upsertSuccessMetadata, deletionSuccessMetadata } =
    transformedResponseToBeBatched;

  const upsertDataChunks = BatchUtils.chunkArrayBySizeAndLength(upsertData, {
    maxItems: customerioConfig.MAX_BATCH_SIZE,
  });

  const deletionDataChunks = BatchUtils.chunkArrayBySizeAndLength(deletionData, {
    maxItems: customerioConfig.MAX_BATCH_SIZE,
  });

  const upsertmetadataChunks = BatchUtils.chunkArrayBySizeAndLength(upsertSuccessMetadata, {
    maxItems: customerioConfig.MAX_BATCH_SIZE,
  });

  const deletionmetadataChunks = BatchUtils.chunkArrayBySizeAndLength(deletionSuccessMetadata, {
    maxItems: customerioConfig.MAX_BATCH_SIZE,
  });

  upsertDataChunks.items.forEach((chunk) => {
    upsertResponseArray.push(responseBuilder(chunk, config, identifierType, segmentId, action));
  });

  deletionDataChunks.items.forEach((chunk) => {
    deletionResponseArray.push(responseBuilder(chunk, config, identifierType, segmentId, action));
  });

  return {
    upsertResponseArray,
    upsertmetadataChunks,
    deletionResponseArray,
    deletionmetadataChunks,
  };
};

/**
 * Process the input message based on the specified action.
 * If the 'fields' in the input message are empty, an error is generated.
 * Determines whether to handle an upsert operation or a deletion operation based on the action.
 *
 * @param {Object} input - The input message containing the fields.
 * @param {string} action - The action to be performed ('insert', 'update', or other).
 * @param {string} segmentId - The segment ID.
 * @param {Object} Config - The configuration object.
 * @param {Object} transformedResponseToBeBatched - The object to store transformed responses.
 * @param {Array} errorResponseList - The list to store error responses.
 * @param {string} identifierType - The type of identifier used.
 */
const processInput = (
  input,
  action,
  segmentId,
  Config,
  transformedResponseToBeBatched,
  errorResponseList,
  identifierType,
) => {
  const { fields } = input.message;

  if (isEmptyObject(fields)) {
    const emptyFieldsError = new InstrumentationError('`fields` cannot be empty');
    errorResponseList.push(handleRtTfSingleEventError(input, emptyFieldsError, {}));
    return;
  }

  handleOperation(input, fields, action, transformedResponseToBeBatched, identifierType);
};

/**
 * Process multiple record inputs for a destination.
 *
 * @param {Array} inputs - The array of record inputs to be processed.
 * @param {Object} destination - The destination object containing configuration.
 * @returns {Array} - An array of responses after processing the record inputs.
 */
const processRecordInputs = async (inputs, destination) => {
  if (!inputs || inputs.length === 0) {
    return [];
  }

  const response = [];
  const errorResponseList = [];
  const { Config } = destination;
  const { action } = inputs[0].message;

  const transformedResponseToBeBatched = {
    upsertData: [],
    upsertSuccessMetadata: [],
    deletionSuccessMetadata: [],
    deletionData: [],
  };

  const { segmentId, identifierType } = deduceSegmentInfo(inputs, Config);

  await Promise.all(
    inputs.map((input) =>
      processInput(
        input,
        action,
        segmentId,
        Config,
        transformedResponseToBeBatched,
        errorResponseList,
        identifierType,
      ),
    ),
  );

  const {
    upsertResponseArray,
    upsertmetadataChunks,
    deletionResponseArray,
    deletionmetadataChunks,
  } = batchResponseBuilder(
    transformedResponseToBeBatched,
    Config,
    identifierType,
    segmentId,
    action,
  );

  if (upsertResponseArray.length === 0 && deletionResponseArray.length === 0) {
    return errorResponseList;
  }

  appendSuccessResponses(response, upsertResponseArray, upsertmetadataChunks, destination);
  appendSuccessResponses(response, deletionResponseArray, deletionmetadataChunks, destination);

  return [...response, ...errorResponseList];
};

module.exports = { processRecordInputs };
