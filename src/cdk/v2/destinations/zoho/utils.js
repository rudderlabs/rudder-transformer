const {
  MappedToDestinationKey,
  getHashFromArray,
  isDefinedAndNotNull,
  ConfigurationError,
} = require('@rudderstack/integrations-lib');
const get = require('get-value');
const { getDestinationExternalIDInfoForRetl } = require('../../../../v0/util');
const zohoConfig = require('./config');

const deduceModuleInfo = (inputs, Config) => {
  const singleRecordInput = inputs[0];
  const operationModuleInfo = {};
  const mappedToDestination = get(singleRecordInput, MappedToDestinationKey);
  if (mappedToDestination) {
    const { objectType, identifierType } = getDestinationExternalIDInfoForRetl(
      singleRecordInput,
      'ZOHO',
    );
    operationModuleInfo.operationModuleType = objectType;
    operationModuleInfo.upsertEndPoint = zohoConfig
      .UPSERT_RECORD_ENDPOINT(Config.region)
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
      throw new ConfigurationError(
        `${objectName} object must have the "${missingFields.join('", "')}" property(ies).`,
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

// Utility to handle duplicate check
const handleDuplicateCheck = (addDefaultDuplicateCheck, identifierType, operationModuleType) => {
  let duplicateCheckFields = [identifierType];

  if (addDefaultDuplicateCheck) {
    const moduleDuplicateCheckField =
      zohoConfig.MODULE_WISE_DUPLICATE_CHECK_FIELD[operationModuleType];

    if (isDefinedAndNotNull(moduleDuplicateCheckField)) {
      duplicateCheckFields = [...moduleDuplicateCheckField];
      duplicateCheckFields.unshift(identifierType);
    } else {
      duplicateCheckFields.push('Name'); // user chosen duplicate field always carries higher priority
    }
  }

  return [...new Set(duplicateCheckFields)];
};

module.exports = {
  deduceModuleInfo,
  validatePresenceOfMandatoryProperties,
  formatMultiSelectFields,
  handleDuplicateCheck,
};
