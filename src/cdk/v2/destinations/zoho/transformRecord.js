const {
  InstrumentationError,
  getHashFromArray,
  ConfigurationError,
} = require('@rudderstack/integrations-lib');
const { BatchUtils } = require('@rudderstack/workflow-engine');
const {
  defaultPostRequestConfig,
  defaultRequestConfig,
  getSuccessRespEvents,
  removeUndefinedAndNullValues,
  handleRtTfSingleEventError,
  isEmptyObject,
} = require('../../../../v0/util');
const zohoConfig = require('./config');
const {
  deduceModuleInfo,
  validatePresenceOfMandatoryProperties,
  formatMultiSelectFields,
  handleDuplicateCheck,
  searchRecordId,
} = require('./utils');

// Main response builder function
const responseBuilder = (items, config, identifierType, operationModuleType, upsertEndPoint) => {
  const { trigger, addDefaultDuplicateCheck, multiSelectFieldLevelDecision } = config;

  const payload = {
    duplicate_check_fields: handleDuplicateCheck(
      addDefaultDuplicateCheck,
      identifierType,
      operationModuleType,
    ),
    data: items,
    $append_values: getHashFromArray(multiSelectFieldLevelDecision, 'from', 'to', false),
    trigger: trigger === 'None' ? null : [trigger],
  };

  const response = defaultRequestConfig();
  response.endpoint = upsertEndPoint;
  response.method = defaultPostRequestConfig.requestMethod;
  response.body.JSON = removeUndefinedAndNullValues(payload);

  return response;
};
const batchResponseBuilder = (
  // items,
  transformedResponseToBeBatched,
  config,
  identifierType,
  operationModuleType,
  upsertEndPoint,
  // successMetadata,
) => {
  const upsertResponseArray = [];
  const deletionResponseArray = [];
  const { upsertData, deletionData, upsertSuccessMetadata, deletionSuccessMetadata } =
    transformedResponseToBeBatched;

  // const batchedDataChunks = {
  //   upsertDataChunks: BatchUtils.chunkArrayBySizeAndLength(upsertData, {
  //     // eslint-disable-next-line unicorn/consistent-destructuring
  //     maxItems: zohoConfig.MAX_BATCH_SIZE,
  //   }),
  //   deletionDataChunks: BatchUtils.chunkArrayBySizeAndLength(deletionData, {
  //     // eslint-disable-next-line unicorn/consistent-destructuring
  //     maxItems: zohoConfig.MAX_BATCH_SIZE,
  //   }),
  // };

  const upsertDataChunks = BatchUtils.chunkArrayBySizeAndLength(upsertData, {
    // eslint-disable-next-line unicorn/consistent-destructuring
    maxItems: zohoConfig.MAX_BATCH_SIZE,
  });

  const deletionDataChunks = BatchUtils.chunkArrayBySizeAndLength(deletionData, {
    // eslint-disable-next-line unicorn/consistent-destructuring
    maxItems: zohoConfig.MAX_BATCH_SIZE,
  });

  // TODO : have to deal metadata grouping as well.
  const upsertmetadataChunks = BatchUtils.chunkArrayBySizeAndLength(upsertSuccessMetadata, {
    // eslint-disable-next-line unicorn/consistent-destructuring
    maxItems: zohoConfig.MAX_BATCH_SIZE,
  });

  const deletionmetadataChunks = BatchUtils.chunkArrayBySizeAndLength(deletionSuccessMetadata, {
    // eslint-disable-next-line unicorn/consistent-destructuring
    maxItems: zohoConfig.MAX_BATCH_SIZE,
  });

  upsertDataChunks.items.forEach((chunk) => {
    upsertResponseArray.push(
      responseBuilder(chunk, config, identifierType, operationModuleType, upsertEndPoint),
    );
  });

  deletionDataChunks.items.forEach((chunk) => {
    deletionResponseArray.push(
      responseBuilder(chunk, config, identifierType, operationModuleType, upsertEndPoint),
    );
  });

  return {
    upsertResponseArray,
    upsertmetadataChunks,
    deletionResponseArray,
    deletionmetadataChunks,
  };
};
const processRecordInputs = (inputs, destination) => {
  let recordIds;
  const response = [];
  const { Config } = destination;
  const transformedResponseToBeBatched = {
    upsertData: [],
    upsertSuccessMetadata: [],
    deletionSuccessMetadata: [],
    deletionData: [],
  };
  // const data = [];
  // const successMetadata = [];
  const errorResponseList = [];

  if (!inputs || inputs.length === 0) {
    return [];
  }

  const invalidActionTypeError = new InstrumentationError(
    'Invalid action type. You can only add or remove IDs from the audience/segment',
  );
  const emptyFieldsError = new InstrumentationError('`fields` cannot be empty');

  const { operationModuleType, identifierType, upsertEndPoint } = deduceModuleInfo(inputs, Config);

  inputs.forEach((input) => {
    const { fields, action } = input.message;
    const isInsertOrDelete = action === 'insert' || action === 'delete';

    if (!isInsertOrDelete) {
      errorResponseList.push(handleRtTfSingleEventError(input, invalidActionTypeError, {}));
      return;
    }

    if (isEmptyObject(fields)) {
      errorResponseList.push(handleRtTfSingleEventError(input, emptyFieldsError, {}));
      return;
    }

    if (action === 'insert') {
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
        // data.push({
        //   ...formattedFields,
        // });
      }
    } else {
      // for record deletion
      recordIds = searchRecordId(fields, input.metadata);
      transformedResponseToBeBatched.deletionData.push(...recordIds);
      transformedResponseToBeBatched.deletionSuccessMetadata.push(input.metadata);
    }
  });

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
    // successMetadata,
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
