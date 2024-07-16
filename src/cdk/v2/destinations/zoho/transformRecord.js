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
  items,
  config,
  identifierType,
  operationModuleType,
  upsertEndPoint,
  successMetadata,
) => {
  const responseArray = [];
  const itemsChunks = BatchUtils.chunkArrayBySizeAndLength(items, {
    // eslint-disable-next-line unicorn/consistent-destructuring
    maxItems: zohoConfig.MAX_BATCH_SIZE,
  });

  const metadataChunks = BatchUtils.chunkArrayBySizeAndLength(successMetadata, {
    // eslint-disable-next-line unicorn/consistent-destructuring
    maxItems: zohoConfig.MAX_BATCH_SIZE,
  });

  itemsChunks.items.forEach((chunk) => {
    responseArray.push(
      responseBuilder(chunk, config, identifierType, operationModuleType, upsertEndPoint),
    );
  });

  return { responseArray, metadataChunks };
};
const processRecordInputs = (inputs, destination) => {
  const response = [];
  const { Config } = destination;
  const data = [];
  const successMetadata = [];
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
    const isInsertOrDelete = action === 'insert';
    // || action === 'delete'; // we are not supporting record deletion for now

    if (!isInsertOrDelete) {
      errorResponseList.push(handleRtTfSingleEventError(input, invalidActionTypeError, {}));
      return;
    }

    if (isEmptyObject(fields)) {
      errorResponseList.push(handleRtTfSingleEventError(input, emptyFieldsError, {}));
      return;
    }
    const eventErroneous = validatePresenceOfMandatoryProperties(operationModuleType, fields);

    if (eventErroneous && eventErroneous.status) {
      const error = new ConfigurationError(
        `${eventErroneous.missingField} object must have the ${eventErroneous.missingField.join('", "')} property(ies).`,
      );
      errorResponseList.push(handleRtTfSingleEventError(input, error, {}));
    } else {
      const formattedFields = formatMultiSelectFields(Config, fields);

      successMetadata.push(input.metadata);
      data.push({
        ...formattedFields,
      });
    }
  });

  const { responseArray, metadataChunks } = batchResponseBuilder(
    data,
    Config,
    identifierType,
    operationModuleType,
    upsertEndPoint,
    successMetadata,
  );
  if (responseArray.length === 0) {
    return errorResponseList;
  }

  responseArray.forEach((batchedResponse, index) => {
    response.push(
      getSuccessRespEvents(batchedResponse, metadataChunks.items[index], destination, true),
    );
  });

  return [...response, ...errorResponseList];
};

module.exports = { processRecordInputs };
