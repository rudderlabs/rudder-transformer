import {
  InstrumentationError,
  ConfigurationError,
  RetryableError,
  NetworkError,
} from '@rudderstack/integrations-lib';
import { BatchUtils } from '@rudderstack/workflow-engine';
import {
  defaultPostRequestConfig,
  defaultRequestConfig,
  getSuccessRespEvents,
  removeUndefinedAndNullValues,
  handleRtTfSingleEventError,
  isEmptyObject,
  defaultDeleteRequestConfig,
  getHashFromArray,
} from '../../../../v0/util';
import * as zohoConfig from './config';
import {
  deduceModuleInfoV2,
  validatePresenceOfMandatoryPropertiesV2,
  formatMultiSelectFieldsV2,
  handleDuplicateCheckV2,
  searchRecordIdV2,
  calculateTrigger,
  batchedSearchRecordIds,
  getRegion,
  isDeletionLookupBatchingEnabled,
} from './utils';
import { REFRESH_TOKEN } from '../../../../adapters/networkhandler/authConstants';
import { Destination } from '../../../../types';
import {
  ZohoRouterIORequest,
  TransformedResponseToBeBatched,
  DestConfig,
  ZohoMetadata,
  DeletionQueueItem,
  ProcessedCOQLAPIErrorResponse,
  ConfigMap,
} from './types';

// Main response builder function
const responseBuilder = (
  items: unknown[],
  destConfig: DestConfig,
  identifierType: string[],
  operationModuleType: string,
  commonEndPoint: string,
  isUpsert: boolean,
  metadata: ZohoMetadata[],
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
  transformedResponseToBeBatched: TransformedResponseToBeBatched,
  config: unknown,
  destConfig: DestConfig,
  identifierType: string[],
  operationModuleType: string,
  upsertEndPoint: string,
) => {
  const upsertResponseArray: unknown[] = [];
  const deletionResponseArray: unknown[] = [];
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
  input: ZohoRouterIORequest,
  allFields: Record<string, unknown>,
  operationModuleType: string,
  destConfig: DestConfig,
  transformedResponseToBeBatched: TransformedResponseToBeBatched,
  errorResponseList: unknown[],
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
 * Handles COQL search errors and converts them to appropriate error types.
 * Maps Zoho API error codes to specific error classes for proper retry/abort handling.
 *
 * @param {ProcessedCOQLAPIErrorResponse} searchResponse - The error response from COQL search
 * @returns {RetryableError | NetworkError | InstrumentationError} Appropriate error based on response
 *
 * Error mapping:
 * - INVALID_TOKEN: RetryableError with REFRESH_TOKEN auth type (triggers token refresh)
 * - INSTRUMENTATION_ERROR: InstrumentationError (abort event)
 * - Other API errors: NetworkError with status code (retry/abort based on status)
 * - Missing API response: InstrumentationError (abort event)
 */
const handleSearchError = (searchResponse: ProcessedCOQLAPIErrorResponse) => {
  const { apiResponse, apiStatus, message: rootMessage } = searchResponse;
  if (apiResponse && apiStatus) {
    const { code, message } = apiResponse;
    if (code === 'INVALID_TOKEN') {
      return new RetryableError(
        `[Zoho]:: ${JSON.stringify(apiResponse)} during zoho record search`,
        500,
        apiResponse,
        REFRESH_TOKEN,
      );
    }
    if (code === 'INSTRUMENTATION_ERROR') {
      return new InstrumentationError(`failed to fetch zoho id for record for: ${message}`);
    }

    return new NetworkError(`failed to fetch zoho id for record: ${message}`, apiStatus);
  }

  return new InstrumentationError(`failed to fetch zoho id for record: ${rootMessage}`);
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
  input: ZohoRouterIORequest,
  identifiers: Record<string, unknown>,
  destination: Destination,
  destConfig: DestConfig,
  transformedResponseToBeBatched: TransformedResponseToBeBatched,
  errorResponseList: unknown[],
) => {
  const searchResponse = await searchRecordIdV2({
    identifiers,
    metadata: input.metadata,
    destination,
    destConfig,
  });

  if (!searchResponse.status) {
    const error = handleSearchError(searchResponse);
    errorResponseList.push(handleRtTfSingleEventError(input, error, {}));
  } else {
    const recordIds = searchResponse.records.map((record) => record.id);
    transformedResponseToBeBatched.deletionData.push(...recordIds);
    transformedResponseToBeBatched.deletionSuccessMetadata.push(input.metadata);
  }
};

/**
 * Process the input message based on the specified action.
 * If the 'fields' in the input message are empty, an error is generated.
 * Determines whether to handle an upsert operation or queue a deletion operation based on the action.
 *
 * @param {Object} input - The input message containing the fields.
 * @param {string} operationModuleType - The type of operation module.
 * @param {Object} destination - The destination configuration.
 * @param {Object} transformedResponseToBeBatched - The object to store transformed responses.
 * @param {Array} errorResponseList - The list to store error responses.
 * @param {Object} destConfig - The connection destination configuration object.
 * @param {Array} deletionQueue - The queue to store deletion events for batched processing.
 * @param {Array} deletionQueueErrors - The list to store immediate deletion errors.
 */
const processInput = async (
  input: ZohoRouterIORequest,
  operationModuleType: string,
  destination: Destination,
  transformedResponseToBeBatched: TransformedResponseToBeBatched,
  errorResponseList: unknown[],
  destConfig: DestConfig,
  deletionQueue: DeletionQueueItem[],
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
    if (isEmptyObject(identifiers) || !identifiers) {
      const error = new InstrumentationError('`identifiers` cannot be empty');
      errorResponseList.push(handleRtTfSingleEventError(input, error, {}));
      return;
    }

    deletionQueue.push({
      input,
      identifiers,
      destination,
      destConfig,
      eventIndex: deletionQueue.length,
      module: destConfig.object,
    });
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
const appendSuccessResponses = (
  response: unknown[],
  responseArray: unknown[],
  metadataChunks: { items: unknown[][] },
  destination: Destination,
) => {
  responseArray.forEach((batchedResponse, index) => {
    response.push(
      getSuccessRespEvents(batchedResponse, metadataChunks.items[index], destination, true),
    );
  });
};

const handleDeletionBatching = async ({
  object,
  destination,
  deletionQueue,
  identifierMappings,
  transformedResponseToBeBatched,
  errorResponseList,
}: {
  object: string;
  destination: Destination;
  deletionQueue: DeletionQueueItem[];
  identifierMappings: ConfigMap;
  transformedResponseToBeBatched: TransformedResponseToBeBatched;
  errorResponseList: unknown[];
}) => {
  // Batched COQL approach - more efficient, uses IN/OR queries
  const region = getRegion(destination);
  const { secret } = deletionQueue[0].input.metadata;
  const { accessToken } = secret;

  const identifierFields = Object.values(getHashFromArray(identifierMappings));

  const { successMap, errorMap } = await batchedSearchRecordIds({
    deletionQueue,
    region,
    accessToken,
    module: object,
    identifierFields,
  });

  // Phase 3: Process batched search results
  deletionQueue.forEach((queuedEvent) => {
    const { input, eventIndex } = queuedEvent;

    if (errorMap[eventIndex]) {
      // COQL search failed for this event
      const error = handleSearchError(errorMap[eventIndex]);
      errorResponseList.push(handleRtTfSingleEventError(input, error, {}));
    } else if (successMap[eventIndex]) {
      // COQL search succeeded - add record IDs to deletion batch
      transformedResponseToBeBatched.deletionData.push(...successMap[eventIndex]);
      transformedResponseToBeBatched.deletionSuccessMetadata.push(input.metadata);
    } else {
      // Shouldn't reach here - defensive handling
      const error = new ConfigurationError('Unexpected error: no result for deletion event');
      errorResponseList.push(handleRtTfSingleEventError(input, error, {}));
    }
  });
};

/**
 * Process multiple record inputs for a destination.
 *
 * @param {Array} inputs - The array of record inputs to be processed.
 * @param {Object} destination - The destination object containing configuration.
 * @returns {Array} - An array of responses after processing the record inputs.
 */
const processRecordInputsV2 = async (inputs: ZohoRouterIORequest[], destination?: Destination) => {
  if (!inputs || inputs.length === 0) {
    return [];
  }
  if (!destination) {
    return [];
  }

  const response: unknown[] = [];
  const errorResponseList: unknown[] = [];
  // Phase 1: Process all events, queue deletions (don't execute COQL yet)
  const deletionQueue: DeletionQueueItem[] = [];
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

  const transformedResponseToBeBatched: TransformedResponseToBeBatched = {
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
        deletionQueue,
      ),
    ),
  );

  // Phase 2: Execute COQL searches for all queued deletions
  if (deletionQueue.length > 0) {
    const {
      metadata: { workspaceId },
    } = inputs[0];
    const useBatchedDeletion = isDeletionLookupBatchingEnabled(workspaceId);
    if (useBatchedDeletion) {
      await handleDeletionBatching({
        destination,
        deletionQueue,
        identifierMappings,
        object,
        transformedResponseToBeBatched,
        errorResponseList,
      });
    } else {
      // Legacy one-by-one deletion approach
      await Promise.all(
        deletionQueue.map(async (queuedEvent) => {
          const { input, identifiers, destination: dest, destConfig: dConfig } = queuedEvent;
          await handleDeletion(
            input,
            identifiers,
            dest,
            dConfig,
            transformedResponseToBeBatched,
            errorResponseList,
          );
        }),
      );
    }
  }

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

export { processRecordInputsV2 };
