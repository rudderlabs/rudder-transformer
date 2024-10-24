const {
  MappedToDestinationKey,
  getHashFromArray,
  isDefinedAndNotNull,
  ConfigurationError,
  isDefinedAndNotNullAndNotEmpty,
} = require('@rudderstack/integrations-lib');
const get = require('get-value');
const { getDestinationExternalIDInfoForRetl, isHttpStatusSuccess } = require('../../../../v0/util');
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
      .COMMON_RECORD_ENDPOINT(Config.region)
      .replace('moduleType', objectType);
    operationModuleInfo.identifierType = identifierType;
  }
  return operationModuleInfo;
};

// eslint-disable-next-line consistent-return
function validatePresenceOfMandatoryProperties(objectName, object) {
  if (zohoConfig.MODULE_MANDATORY_FIELD_CONFIG.hasOwnProperty(objectName)) {
    const requiredFields = zohoConfig.MODULE_MANDATORY_FIELD_CONFIG[objectName];
    const missingFields =
      requiredFields.filter(
        (field) => !object.hasOwnProperty(field) || !isDefinedAndNotNullAndNotEmpty(object[field]),
      ) || [];
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

// ref : https://www.zoho.com/crm/developer/docs/api/v6/search-records.html
const searchRecordId = async (fields, metadata, Config) => {
  const searchURL = transformToURLParams(fields, Config);
  const searchResult = await handleHttpRequest(
    'get',
    searchURL,
    {
      headers: {
        Authorization: `Zoho-oauthtoken ${metadata.secret.accessToken}`,
      },
    },
    {
      destType: 'zoho',
      feature: 'deleteRecords',
      requestMethod: 'GET',
      endpointPath: 'crm/v6/Leads/search?criteria=',
      module: 'router',
    },
  );
  if (!isHttpStatusSuccess(searchResult.processedResponse.status)) {
    return {
      erroneous: true,
      message: searchResult.processedResponse.response,
    };
  }
  if (searchResult.processedResponse.status === 204) {
    return {
      erroneous: true,
      message: 'No contact is found with record details',
    };
  }
  const recordIds = searchResult.processedResponse.response.data.map((record) => record.id);
  return {
    erroneous: false,
    message: recordIds,
  };
};

// ref : https://www.zoho.com/crm/developer/docs/api/v6/upsert-records.html#:~:text=The%20trigger%20input%20can%20be%20workflow%2C%20approval%2C%20or%20blueprint.%20If%20the%20trigger%20is%20not%20mentioned%2C%20the%20workflows%2C%20approvals%20and%20blueprints%20related%20to%20the%20API%20will%20get%20executed.%20Enter%20the%20trigger%20value%20as%20%5B%5D%20to%20not%20execute%20the%20workflows.
const calculateTrigger = (trigger) => {
  if (trigger === 'Default') {
    return null;
  }
  if (trigger === 'None') {
    return [];
  }
  return [trigger];
};

const validateConfigurationIssue = (Config, operationModuleType, action) => {
  const hashMapMultiselect = getHashFromArray(
    Config.multiSelectFieldLevelDecision,
    'from',
    'to',
    false,
  );
  if (
    Object.keys(hashMapMultiselect).length > 0 &&
    Config.module !== operationModuleType &&
    action !== 'delete'
  ) {
    throw new ConfigurationError(
      'Object Chosen in Visual Data Mapper is not consistent with Module type selected in destination configuration. Aborting Events.',
    );
  }
};

module.exports = {
  deduceModuleInfo,
  validatePresenceOfMandatoryProperties,
  formatMultiSelectFields,
  handleDuplicateCheck,
  searchRecordId,
  transformToURLParams,
  calculateTrigger,
  validateConfigurationIssue,
};
