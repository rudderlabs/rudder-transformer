const {
  getHashFromArray,
  isDefinedAndNotNull,
  ConfigurationError,
  isDefinedAndNotNullAndNotEmpty,
  removeUndefinedNullEmptyExclBoolInt,
} = require('@rudderstack/integrations-lib');
const { getDestinationExternalIDInfoForRetl, isHttpStatusSuccess } = require('../../../../v0/util');
const zohoConfig = require('./config');
const { handleHttpRequest } = require('../../../../adapters/network');
const { CommonUtils } = require('../../../../util/common');

const deduceModuleInfo = (inputs, Config) => {
  if (!Array.isArray(inputs) || inputs.length === 0) {
    return {};
  }

  const firstRecord = inputs[0].message;
  const mappedToDestination = firstRecord?.context?.mappedToDestination;

  if (!mappedToDestination) {
    return {};
  }

  const { objectType, identifierType } = getDestinationExternalIDInfoForRetl(firstRecord, 'ZOHO');
  return {
    operationModuleType: objectType,
    upsertEndPoint: zohoConfig
      .COMMON_RECORD_ENDPOINT(Config.region)
      .replace('moduleType', objectType),
    identifierType,
  };
};

const deduceModuleInfoV2 = (Config, destConfig) => {
  const { object, identifierMappings } = destConfig;
  const identifierType = identifierMappings.map(({ to }) => to);
  return {
    operationModuleType: object,
    upsertEndPoint: zohoConfig.COMMON_RECORD_ENDPOINT(Config.region).replace('moduleType', object),
    identifierType,
  };
};

// Keeping the original function name and return structure
function validatePresenceOfMandatoryProperties(objectName, object) {
  if (!zohoConfig.MODULE_MANDATORY_FIELD_CONFIG.hasOwnProperty(objectName)) {
    return undefined; // Maintaining original undefined return for custom objects
  }

  const requiredFields = zohoConfig.MODULE_MANDATORY_FIELD_CONFIG[objectName];
  const missingFields = requiredFields.filter(
    (field) => !object.hasOwnProperty(field) || !isDefinedAndNotNullAndNotEmpty(object[field]),
  );

  return {
    status: missingFields.length > 0,
    missingField: missingFields,
  };
}

const formatMultiSelectFields = (config, fields) => {
  const multiSelectFields = getHashFromArray(
    config.multiSelectFieldLevelDecision,
    'from',
    'to',
    false,
  );

  // Creating a shallow copy to avoid mutations
  const formattedFields = { ...fields };

  Object.keys(formattedFields).forEach((eachFieldKey) => {
    if (
      multiSelectFields.hasOwnProperty(eachFieldKey) &&
      isDefinedAndNotNull(formattedFields[eachFieldKey])
    ) {
      formattedFields[eachFieldKey] = [formattedFields[eachFieldKey]];
    }
  });

  return formattedFields;
};

const formatMultiSelectFieldsV2 = (destConfig, fields) => {
  const multiSelectFields = getHashFromArray(
    destConfig.multiSelectFieldLevelDecision,
    'from',
    'to',
    false,
  );
  // Creating a shallow copy to avoid mutations
  const formattedFields = { ...fields };
  Object.keys(formattedFields).forEach((eachFieldKey) => {
    if (
      multiSelectFields.hasOwnProperty(eachFieldKey) &&
      isDefinedAndNotNull(formattedFields[eachFieldKey])
    ) {
      formattedFields[eachFieldKey] = [formattedFields[eachFieldKey]];
    }
  });
  return formattedFields;
};

const handleDuplicateCheck = (addDefaultDuplicateCheck, identifierType, operationModuleType) => {
  let additionalFields = [];

  if (addDefaultDuplicateCheck) {
    const moduleDuplicateCheckField =
      zohoConfig.MODULE_WISE_DUPLICATE_CHECK_FIELD[operationModuleType];
    additionalFields = isDefinedAndNotNull(moduleDuplicateCheckField)
      ? moduleDuplicateCheckField
      : ['Name'];
  }

  return Array.from(new Set([identifierType, ...additionalFields]));
};

const handleDuplicateCheckV2 = (addDefaultDuplicateCheck, identifierType, operationModuleType) => {
  let additionalFields = [];

  if (addDefaultDuplicateCheck) {
    const moduleDuplicateCheckField =
      zohoConfig.MODULE_WISE_DUPLICATE_CHECK_FIELD[operationModuleType];
    additionalFields = isDefinedAndNotNull(moduleDuplicateCheckField)
      ? moduleDuplicateCheckField
      : ['Name'];
  }

  return Array.from(new Set([...identifierType, ...additionalFields]));
};

// Zoho has limitation that where clause should be formatted in a specific way
// ref: https://www.zoho.com/crm/developer/docs/api/v6/COQL-Limitations.html
const groupConditions = (conditions) => {
  if (conditions.length === 1) {
    return conditions[0]; // No need for grouping with a single condition
  }
  if (conditions.length === 2) {
    return `(${conditions[0]} AND ${conditions[1]})`; // Base case
  }
  return `(${groupConditions(conditions.slice(0, 2))} AND ${groupConditions(conditions.slice(2))})`;
};

// supported data type in where clause
// ref: https://help.zoho.com/portal/en/kb/creator/developer-guide/forms/add-and-manage-fields/articles/understand-fields#Types_of_fields
// ref: https://www.zoho.com/crm/developer/docs/api/v6/Get-Records-through-COQL-Query.html
const generateWhereClause = (fields) => {
  const conditions = Object.keys(removeUndefinedNullEmptyExclBoolInt(fields)).map((key) => {
    const value = fields[key];
    if (Array.isArray(value)) {
      return `${key} = '${value.join(';')}'`;
    }
    if (typeof value === 'number') {
      return `${key} = ${value}`;
    }
    return `${key} = '${value}'`;
  });

  return conditions.length > 0 ? `WHERE ${groupConditions(conditions)}` : '';
};

const generateSqlQuery = (module, fields) => {
  // Generate the WHERE clause based on the fields
  // Limiting to 25 fields
  const entries = Object.entries(fields).slice(0, 25);
  const whereClause = generateWhereClause(Object.fromEntries(entries));
  if (whereClause === '') {
    return '';
  }

  // Construct the SQL query with specific fields in the SELECT clause
  return `SELECT id FROM ${module} ${whereClause}`;
};

const sendCOQLRequest = async (region, accessToken, object, selectQuery) => {
  try {
    if (selectQuery === '') {
      return {
        erroneous: true,
        code: 'INSTRUMENTATION_ERROR',
        message: `Identifier values are not provided for ${object}`,
      };
    }

    const searchURL = `${zohoConfig.DATA_CENTRE_BASE_ENDPOINTS_MAP[region]}/crm/v6/coql`;
    const searchResult = await handleHttpRequest(
      'post',
      searchURL,
      {
        select_query: selectQuery,
      },
      {
        headers: {
          Authorization: `Zoho-oauthtoken ${accessToken}`,
        },
      },
      {
        destType: 'zoho',
        feature: 'deleteRecords',
        requestMethod: 'POST',
        endpointPath: searchURL,
        module: 'router',
      },
    );

    if (!isHttpStatusSuccess(searchResult.processedResponse.status)) {
      return {
        erroneous: true,
        message: searchResult.processedResponse.response,
      };
    }

    if (
      searchResult.processedResponse.status === 204 ||
      !CommonUtils.isNonEmptyArray(searchResult.processedResponse.response?.data)
    ) {
      return {
        erroneous: true,
        message: `No ${object} is found with record details`,
      };
    }

    return {
      erroneous: false,
      message: searchResult.processedResponse.response.data.map((record) => record.id),
    };
  } catch (error) {
    return {
      erroneous: true,
      message: error.message,
    };
  }
};

const searchRecordId = async (fields, metadata, Config, operationModuleType, identifierType) => {
  try {
    const { region } = Config;

    const selectQuery = generateSqlQuery(operationModuleType, {
      [identifierType]: fields[identifierType],
    });
    const result = await sendCOQLRequest(
      region,
      metadata.secret.accessToken,
      operationModuleType,
      selectQuery,
    );
    return result;
  } catch (error) {
    return {
      erroneous: true,
      message: error.message,
    };
  }
};

const searchRecordIdV2 = async (identifiers, metadata, Config, destConfig) => {
  try {
    const { region } = Config;
    const { object } = destConfig;

    const selectQuery = generateSqlQuery(object, identifiers);
    const result = await sendCOQLRequest(region, metadata.secret.accessToken, object, selectQuery);
    return result;
  } catch (error) {
    return {
      erroneous: true,
      message: error.message,
    };
  }
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

const validateConfigurationIssue = (Config, operationModuleType) => {
  const hashMapMultiselect = getHashFromArray(
    Config.multiSelectFieldLevelDecision,
    'from',
    'to',
    false,
  );

  if (Object.keys(hashMapMultiselect).length > 0 && Config.module !== operationModuleType) {
    throw new ConfigurationError(
      'Object Chosen in Visual Data Mapper is not consistent with Module type selected in destination configuration. Aborting Events.',
    );
  }
};

module.exports = {
  deduceModuleInfo,
  deduceModuleInfoV2,
  validatePresenceOfMandatoryProperties,
  formatMultiSelectFields,
  formatMultiSelectFieldsV2,
  handleDuplicateCheck,
  handleDuplicateCheckV2,
  searchRecordId,
  searchRecordIdV2,
  calculateTrigger,
  validateConfigurationIssue,
};
