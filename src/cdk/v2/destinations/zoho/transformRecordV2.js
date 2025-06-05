const {
  InstrumentationError,
  ConfigurationError,
  RetryableError,
} = require('@rudderstack/integrations-lib');
const { BatchUtils } = require('@rudderstack/workflow-engine');
const {
  defaultPostRequestConfig,
  defaultRequestConfig,
  getSuccessRespEvents,
  removeUndefinedAndNullValues,
  handleRtTfSingleEventError,
  isEmptyObject,
  defaultDeleteRequestConfig,
  getHashFromArray,
} = require('../../../../v0/util');
const zohoConfig = require('./config');
const {
  deduceModuleInfoV2,
  validatePresenceOfMandatoryPropertiesV2,
  formatMultiSelectFieldsV2,
  handleDuplicateCheckV2,
  searchRecordIdV2,
  calculateTrigger,
} = require('./utils');
const { REFRESH_TOKEN } = require('../../../../adapters/networkhandler/authConstants');

// Main response builder function
const responseBuilder = (
  items,
  destConfig,
  identifierType,
  operationModuleType,
  commonEndPoint,
  isUpsert,
  metadata,
) => {
  const { trigger, addDefaultDuplicateCheck, multiSelectFieldLevelDecision } = destConfig;

  const response = defaultRequestConfig();
  response.headers = {
    Authorization: `Zoho-oauthtoken ${metadata[0].secret.accessToken}`,
  };

  const multiSelectFieldLevelDecisionAcc = getHashFromArray(
    multiSelectFieldLevelDecision,
    'from',
    'to',
    false,
  );

  if (isUpsert) {
    const payload = {
      duplicate_check_fields: handleDuplicateCheckV2(
        addDefaultDuplicateCheck,
        identifierType,
        operationModuleType,
      ),
      data: items,
      $append_values: multiSelectFieldLevelDecisionAcc || {},
      trigger: calculateTrigger(trigger),
    };
    response.method = defaultPostRequestConfig.requestMethod;
    response.body.JSON = removeUndefinedAndNullValues(payload);
    response.endpoint = `${commonEndPoint}/upsert`;
  } else {
    response.endpoint = `${commonEndPoint}?ids=${items.join(',')}&wf_trigger=${trigger !== 'None'}`;
    response.method = defaultDeleteRequestConfig.requestMethod;
  }

  return response;
};
const batchResponseBuilder = (
  transformedResponseToBeBatched,
  config,
  destConfig,
  identifierType,
  operationModuleType,
  upsertEndPoint,
) => {
  const upsertResponseArray = [];
  const deletionResponseArray = [];
  const { upsertData, deletionData, upsertSuccessMetadata, deletionSuccessMetadata } =
    transformedResponseToBeBatched;

  const upsertDataChunks = BatchUtils.chunkArrayBySizeAndLength(upsertData, {
    maxItems: zohoConfig.MAX_BATCH_SIZE,
  });

  const deletionDataChunks = BatchUtils.chunkArrayBySizeAndLength(deletionData, {
    maxItems: zohoConfig.MAX_BATCH_SIZE,
  });

  const upsertmetadataChunks = BatchUtils.chunkArrayBySizeAndLength(upsertSuccessMetadata, {
    maxItems: zohoConfig.MAX_BATCH_SIZE,
  });

  const deletionmetadataChunks = BatchUtils.chunkArrayBySizeAndLength(deletionSuccessMetadata, {
    maxItems: zohoConfig.MAX_BATCH_SIZE,
  });

  upsertDataChunks.items.forEach((chunk) => {
    upsertResponseArray.push(
      responseBuilder(
        chunk,
        destConfig,
        identifierType,
        operationModuleType,
        upsertEndPoint,
        true,
        upsertmetadataChunks.items[0],
      ),
    );
  });

  deletionDataChunks.items.forEach((chunk) => {
    deletionResponseArray.push(
      responseBuilder(
        chunk,
        destConfig,
        identifierType,
        operationModuleType,
        upsertEndPoint,
        false,
        deletionmetadataChunks.items[0],
      ),
    );
  });

  return {
    upsertResponseArray,
    upsertmetadataChunks,
    deletionResponseArray,
    deletionmetadataChunks,
  };
};

/**
 * Handles the upsert operation for a specific module type by validating mandatory properties,
 * processing the input fields, and updating the response accordingly.
 *
 * @param {Object} input - The input data for the upsert operation.
 * @param {Object} allFields - The fields to be upserted.
 * @param {string} operationModuleType - The type of module operation being performed.
 * @param {Object} conConfig - The connection configuration object
 * @param {Object} transformedResponseToBeBatched - The response object to be batched.
 * @param {Array} errorResponseList - The list to store error responses.
 * @returns {Promise<void>} - A promise that resolves once the upsert operation is handled.
 */
const handleUpsert = async (
  input,
  allFields,
  operationModuleType,
  destConfig,
  transformedResponseToBeBatched,
  errorResponseList,
) => {
  const eventErroneous = validatePresenceOfMandatoryPropertiesV2(destConfig.object, allFields);

  if (eventErroneous?.status) {
    const error = new ConfigurationError(
      `${operationModuleType} object must have the ${eventErroneous.missingField.join('", "')} property(ies).`,
    );
    errorResponseList.push(handleRtTfSingleEventError(input, error, {}));
  } else {
    const formattedFields = formatMultiSelectFieldsV2(destConfig, allFields);
    transformedResponseToBeBatched.upsertSuccessMetadata.push(input.metadata);
    transformedResponseToBeBatched.upsertData.push(formattedFields);
  }
};

/**
 * Handles search errors in Zoho record search.
 * If the search response message code is 'INVALID_TOKEN', returns a RetryableError with a specific message and status code.
 * Otherwise, returns a ConfigurationError with a message indicating failure to fetch Zoho ID for a record.
 *
 * @param {Object} searchResponse - The response object from the search operation.
 * @returns {RetryableError|ConfigurationError} - The error object based on the search response.
 */
const handleSearchError = (searchResponse) => {
  if (searchResponse.message.code === 'INVALID_TOKEN') {
    return new RetryableError(
      `[Zoho]:: ${JSON.stringify(searchResponse.message)} during zoho record search`,
      500,
      searchResponse.message,
      REFRESH_TOKEN,
    );
  }
  if (searchResponse.message.code === 'INSTRUMENTATION_ERROR') {
    return new InstrumentationError(
      `failed to fetch zoho id for record for: ${searchResponse.message}`,
    );
  }
  return new ConfigurationError(
    `failed to fetch zoho id for record for ${JSON.stringify(searchResponse.message)}`,
  );
};

/**
 * Asynchronously handles the deletion operation based on the search response.
 *
 * @param {Object} input - The input object containing metadata and other details.
 * @param {Array} fields - The fields to be used for searching the record.
 * @param {Object} Config - The configuration object.
 * @param {Object} transformedResponseToBeBatched - The object to store transformed response data to be batched.
 * @param {Array} errorResponseList - The list to store error responses.
 */
const handleDeletion = async (
  input,
  identifiers,
  destination,
  destConfig,
  transformedResponseToBeBatched,
  errorResponseList,
) => {
  const searchResponse = await searchRecordIdV2({
    identifiers,
    metadata: input.metadata,
    destination,
    destConfig,
  });

  if (searchResponse.erroneous) {
    const error = handleSearchError(searchResponse);
    errorResponseList.push(handleRtTfSingleEventError(input, error, {}));
  } else {
    transformedResponseToBeBatched.deletionData.push(...searchResponse.message);
    transformedResponseToBeBatched.deletionSuccessMetadata.push(input.metadata);
  }
};

/**
 * Process the input message based on the specified action.
 * If the 'fields' in the input message are empty, an error is generated.
 * Determines whether to handle an upsert operation or a deletion operation based on the action.
 *
 * @param {Object} input - The input message containing the fields.
 * @param {string} action - The action to be performed ('insert', 'update', or other).
 * @param {string} operationModuleType - The type of operation module.
 * @param {Object} Config - The configuration object.
 * @param {Object} transformedResponseToBeBatched - The object to store transformed responses.
 * @param {Array} errorResponseList - The list to store error responses.
 * @param {Object} conConfig - The connection configuration object.
 */
const processInput = async (
  input,
  operationModuleType,
  destination,
  transformedResponseToBeBatched,
  errorResponseList,
  destConfig,
) => {
  const { fields, action, identifiers } = input.message;
  const allFields = { ...identifiers, ...fields };

  if (isEmptyObject(allFields)) {
    const emptyFieldsError = new InstrumentationError('`fields` cannot be empty');
    errorResponseList.push(handleRtTfSingleEventError(input, emptyFieldsError, {}));
    return;
  }

  if (action === 'insert' || action === 'update') {
    await handleUpsert(
      input,
      allFields,
      operationModuleType,
      destConfig,
      transformedResponseToBeBatched,
      errorResponseList,
    );
  } else {
    if (isEmptyObject(identifiers)) {
      const error = new InstrumentationError('`identifiers` cannot be empty');
      errorResponseList.push(handleRtTfSingleEventError(input, error, {}));
      return;
    }

    await handleDeletion(
      input,
      identifiers,
      destination,
      destConfig,
      transformedResponseToBeBatched,
      errorResponseList,
    );
  }
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

/**
 * Process multiple record inputs for a destination.
 *
 * @param {Array} inputs - The array of record inputs to be processed.
 * @param {Object} destination - The destination object containing configuration.
 * @returns {Array} - An array of responses after processing the record inputs.
 */
const processRecordInputsV2 = async (inputs, destination) => {
  if (!inputs || inputs.length === 0) {
    return [];
  }
  if (!destination) {
    return [];
  }

  const response = [];
  const errorResponseList = [];
  const { Config } = destination;
  const { destination: destConfig } = inputs[0].connection?.config || {};
  if (!destConfig) {
    throw new ConfigurationError('Connection destination config is required');
  }
  const { object, identifierMappings } = destConfig;
  if (!object || !identifierMappings) {
    throw new ConfigurationError(
      'Object and identifierMappings are required in destination config',
    );
  }

  const transformedResponseToBeBatched = {
    upsertData: [],
    upsertSuccessMetadata: [],
    deletionSuccessMetadata: [],
    deletionData: [],
  };

  const { operationModuleType, identifierType, upsertEndPoint } = deduceModuleInfoV2(
    destination,
    destConfig,
  );

  await Promise.all(
    inputs.map((input) =>
      processInput(
        input,
        operationModuleType,
        destination,
        transformedResponseToBeBatched,
        errorResponseList,
        destConfig,
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
    destConfig,
    identifierType,
    operationModuleType,
    upsertEndPoint,
  );

  if (upsertResponseArray.length === 0 && deletionResponseArray.length === 0) {
    return errorResponseList;
  }

  appendSuccessResponses(response, upsertResponseArray, upsertmetadataChunks, destination);
  appendSuccessResponses(response, deletionResponseArray, deletionmetadataChunks, destination);

  return [...response, ...errorResponseList];
};

module.exports = { processRecordInputsV2 };
