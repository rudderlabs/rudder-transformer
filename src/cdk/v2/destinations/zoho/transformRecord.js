const {
  InstrumentationError,
  getHashFromArray,
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
} = require('../../../../v0/util');
const zohoConfig = require('./config');
const {
  deduceModuleInfo,
  validatePresenceOfMandatoryProperties,
  formatMultiSelectFields,
  handleDuplicateCheck,
  searchRecordId,
  calculateTrigger,
} = require('./utils');
const { REFRESH_TOKEN } = require('../../../../adapters/networkhandler/authConstants');

// Main response builder function
const responseBuilder = (
  items,
  config,
  identifierType,
  operationModuleType,
  commonEndPoint,
  action,
  metadata,
) => {
  const { trigger, addDefaultDuplicateCheck, multiSelectFieldLevelDecision } = config;

  const response = defaultRequestConfig();
  response.headers = {
    Authorization: `Zoho-oauthtoken ${metadata[0].secret.accessToken}`,
  };

  if (action === 'insert' || action === 'update') {
    const payload = {
      duplicate_check_fields: handleDuplicateCheck(
        addDefaultDuplicateCheck,
        identifierType,
        operationModuleType,
      ),
      data: items,
      $append_values: getHashFromArray(multiSelectFieldLevelDecision, 'from', 'to', false),
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
  identifierType,
  operationModuleType,
  upsertEndPoint,
  action,
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
        config,
        identifierType,
        operationModuleType,
        upsertEndPoint,
        action,
        upsertmetadataChunks.items[0],
      ),
    );
  });

  deletionDataChunks.items.forEach((chunk) => {
    deletionResponseArray.push(
      responseBuilder(
        chunk,
        config,
        identifierType,
        operationModuleType,
        upsertEndPoint,
        action,
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
const processRecordInputs = async (inputs, destination) => {
  const response = [];
  const { Config } = destination;
  const transformedResponseToBeBatched = {
    upsertData: [],
    upsertSuccessMetadata: [],
    deletionSuccessMetadata: [],
    deletionData: [],
  };

  const { action } = inputs[0].message;
  const errorResponseList = [];

  if (!inputs || inputs.length === 0) {
    return [];
  }

  const emptyFieldsError = new InstrumentationError('`fields` cannot be empty');

  const { operationModuleType, identifierType, upsertEndPoint } = deduceModuleInfo(inputs, Config);

  const processInput = async (input) => {
    const { fields } = input.message;

    if (isEmptyObject(fields)) {
      errorResponseList.push(handleRtTfSingleEventError(input, emptyFieldsError, {}));
      return;
    }

    if (action === 'insert' || action === 'update') {
      const eventErroneous = validatePresenceOfMandatoryProperties(operationModuleType, fields);

      if (eventErroneous && eventErroneous.status) {
        const error = new ConfigurationError(
          `${eventErroneous.missingField} object must have the ${eventErroneous.missingField.join('", "')} property(ies).`,
        );
        errorResponseList.push(handleRtTfSingleEventError(input, error, {}));
      } else {
        const formattedFields = formatMultiSelectFields(Config, fields);
        transformedResponseToBeBatched.upsertSuccessMetadata.push(input.metadata);
        transformedResponseToBeBatched.upsertData.push({
          ...formattedFields,
        });
      }
    } else {
      // for record deletion
      let error;
      const searchResponse = await searchRecordId(fields, input.metadata, Config);
      if (searchResponse.erroneous) {
        if (searchResponse.message.code === 'INVALID_TOKEN') {
          error = new RetryableError(
            `[Zoho]:: ${JSON.stringify(searchResponse.message)} during zoho record search`,
            500,
            response,
            REFRESH_TOKEN,
          );
        } else {
          error = new ConfigurationError(
            `failed to fetch zoho id for record for ${JSON.stringify(searchResponse.message)}`,
          );
        }
        errorResponseList.push(handleRtTfSingleEventError(input, error, {}));
      } else {
        transformedResponseToBeBatched.deletionData.push(...searchResponse.message);
        transformedResponseToBeBatched.deletionSuccessMetadata.push(input.metadata);
      }
    }
  };

  await Promise.all(inputs.map(processInput));

  const {
    upsertResponseArray,
    upsertmetadataChunks,
    deletionResponseArray,
    deletionmetadataChunks,
  } = batchResponseBuilder(
    transformedResponseToBeBatched,
    Config,
    identifierType,
    operationModuleType,
    upsertEndPoint,
    action,
  );

  if (upsertResponseArray.length === 0 && deletionResponseArray.length === 0) {
    return errorResponseList;
  }

  upsertResponseArray.forEach((batchedResponse, index) => {
    response.push(
      getSuccessRespEvents(batchedResponse, upsertmetadataChunks.items[index], destination, true),
    );
  });

  deletionResponseArray.forEach((batchedResponse, index) => {
    response.push(
      getSuccessRespEvents(batchedResponse, deletionmetadataChunks.items[index], destination, true),
    );
  });

  return [...response, ...errorResponseList];
};

module.exports = { processRecordInputs };
