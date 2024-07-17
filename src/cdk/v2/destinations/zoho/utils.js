const {
  MappedToDestinationKey,
  getHashFromArray,
  isDefinedAndNotNull,
} = require('@rudderstack/integrations-lib');
const get = require('get-value');
const { getDestinationExternalIDInfoForRetl } = require('../../../../v0/util');
const zohoConfig = require('./config');
const { handleHttpRequest } = require('../../../../adapters/network');

const deduceModuleInfo = (inputs, Config) => {
  const singleRecordInput = inputs[0].message;
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

// eslint-disable-next-line consistent-return
function validatePresenceOfMandatoryProperties(objectName, object) {
  if (zohoConfig.MODULE_MANDATORY_FIELD_CONFIG.hasOwnProperty(objectName)) {
    const requiredFields = zohoConfig.MODULE_MANDATORY_FIELD_CONFIG[objectName];
    const missingFields = requiredFields.filter((field) => !object.hasOwnProperty(field)) || [];
    return { status: missingFields.length > 0, missingField: missingFields };
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

function escapeAndEncode(value) {
  return encodeURIComponent(value.replace(/([(),\\])/g, '\\$1'));
}

function transformToURLParams(fields, Config) {
  const criteria = Object.entries(fields)
    .map(([key, value]) => `(${key}:equals:${escapeAndEncode(value)})`)
    .join('and');

    const dataCenter = Config.region;
    const regionBasedEndPoint = zohoConfig.DATA_CENTRE_BASE_ENDPOINTS_MAP[dataCenter];

  return `${regionBasedEndPoint}/crm/v6/Leads/search?criteria=${criteria}`;
}
const searchRecordId = (fields, Config, metadata) => {
  const searchURL = transformToURLParams(fields);
  const searchResult = await handleHttpRequest(
    'get',
    searchURL,
    { Authorization: `Zoho-oauthtoken ${metadata.secret.accessToken}` },
    {
      destType: 'zoho',
      feature: 'deleteRecords',
      requestMethod: 'GET',
      endpointPath: 'crm/v6/Leads/search?criteria=',
      module: 'router',
    },
  );
  const recordIds = searchResult.response.data.map(record => record.id);
  return recordIds;
};

module.exports = {
  deduceModuleInfo,
  validatePresenceOfMandatoryProperties,
  formatMultiSelectFields,
  handleDuplicateCheck,
  searchRecordId,
  transformToURLParams,
};
