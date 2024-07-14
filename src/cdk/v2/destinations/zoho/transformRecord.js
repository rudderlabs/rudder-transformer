const {
  InstrumentationError,
  MappedToDestinationKey,
  getHashFromArray,
  isDefinedAndNotNull,
} = require('@rudderstack/integrations-lib');
const { BatchUtils } = require('@rudderstack/workflow-engine');
const get = require('get-value');
const {
  defaultPostRequestConfig,
  defaultRequestConfig,
  getSuccessRespEvents,
  removeUndefinedAndNullValues,
  handleRtTfSingleEventError,
  isEmptyObject,
  getDestinationExternalIDInfoForRetl,
} = require('../../../../v0/util');
const zohoConfig = require('./config');

// Utility to handle duplicate check
const handleDuplicateCheck = (
  addDefaultDuplicateCheck,
  identifierType,
  operationModuleType,
  moduleWiseDuplicateCheckField,
) => {
  let duplicateCheckFields = [identifierType];

  if (addDefaultDuplicateCheck) {
    const moduleDuplicateCheckField = moduleWiseDuplicateCheckField[operationModuleType];

    if (isDefinedAndNotNull(moduleDuplicateCheckField)) {
      duplicateCheckFields = [...moduleDuplicateCheckField];
      duplicateCheckFields.unshift(identifierType);
    } else {
      duplicateCheckFields.push('Name'); // user chosen duplicate field always carries higher priority
    }
  }

  return duplicateCheckFields;
};

// Main response builder function
const responseBuilder = (items, config, identifierType, operationModuleType, upsertEndPoint) => {
  const { trigger, addDefaultDuplicateCheck, multiSelectFieldLevelDecision } = config;

  const payload = {
    duplicate_check_fields: handleDuplicateCheck(
      addDefaultDuplicateCheck,
      identifierType,
      operationModuleType,
      zohoConfig.MODULE_WISE_DUPLICATE_CHECK_FIELD,
    ),
    data: items,
    $append_values: getHashFromArray(multiSelectFieldLevelDecision, 'from', 'to', false),
    trigger: [trigger],
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
) => {
  const response = [];
  const itemsChunks = BatchUtils.chunkArrayBySizeAndLength(items, {
    // eslint-disable-next-line unicorn/consistent-destructuring
    maxItems: zohoConfig.MAX_BATCH_SIZE,
  });

  itemsChunks.items.forEach((chunk) => {
    response.push(
      responseBuilder(chunk, config, identifierType, operationModuleType, upsertEndPoint),
    );
  });

  return response;
};

const deduceModuleInfo = (inputs) => {
  const singleRecordInput = inputs[0];
  const operationModuleInfo = {};
  const mappedToDestination = get(singleRecordInput, MappedToDestinationKey);
  if (mappedToDestination) {
    const { objectType, identifierType } = getDestinationExternalIDInfoForRetl(
      singleRecordInput,
      'ZOHO',
    );
    operationModuleInfo.operationModuleType = objectType;
    // TODO: handle other data centers
    operationModuleInfo.upsertEndPoint = zohoConfig
      .UPSERT_RECORD_ENDPOINT('IN')
      .replace('moduleType', objectType);
    operationModuleInfo.identifierType = identifierType;
  }
  return operationModuleInfo;
};

function validatePresenceOfMandatoryProperties(objectName, object) {
  if (zohoConfig.MODULE_MANDATORY_FIELD_CONFIG.hasOwnProperty(objectName)) {
    const requiredFields = zohoConfig.MODULE_MANDATORY_FIELD_CONFIG[objectName];
    const missingFields = requiredFields.filter((field) => !object.hasOwnProperty(field));
    if (missingFields.length > 0) {
      throw new Error(
        `Validation Error: ${objectName} object must have the "${missingFields.join('", "')}" property(ies).`,
      );
    }
  }
  // No mandatory check performed for custom objects
}

const formatMultiSelectFields = (config, fields) => {
  // Convert multiSelectFieldLevelDecision array into a hash map for quick lookups
  const multiSelectFields = getHashFromArray(
    config.multiSelectFieldLevelDecision,
    'from',
    'to',
    false,
  );

  Object.keys(fields).forEach((eachFieldKey) => {
    if (multiSelectFields.hasOwnProperty(eachFieldKey)) {
      // eslint-disable-next-line no-param-reassign
      fields[eachFieldKey] = [fields[eachFieldKey]];
    }
  });
  return fields;
};

const processRecordInputs = (inputs, destination) => {
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

  const { operationModuleType, identifierType, upsertEndPoint } = deduceModuleInfo(inputs);

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
    validatePresenceOfMandatoryProperties(operationModuleType, fields);

    const formattedFields = formatMultiSelectFields(Config, fields);

    successMetadata.push(input.metadata);
    data.push({
      ...formattedFields,
    });
  });

  const payloads = batchResponseBuilder(
    data,
    Config,
    identifierType,
    operationModuleType,
    upsertEndPoint,
  );
  if (payloads.length === 0) {
    return errorResponseList;
  }

  const response = getSuccessRespEvents(payloads, successMetadata, destination, true);
  return [response, ...errorResponseList];
};

module.exports = { processRecordInputs };
