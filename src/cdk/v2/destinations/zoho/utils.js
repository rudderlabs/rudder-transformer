const {
  getHashFromArray,
  isDefinedAndNotNull,
  ConfigurationError,
  PlatformError,
  isDefinedAndNotNullAndNotEmpty,
  removeUndefinedNullEmptyExclBoolInt,
  ZOHO_SDK,
} = require('@rudderstack/integrations-lib');
const { isEmpty } = require('lodash');
const { isHttpStatusSuccess } = require('../../../../v0/util');
const { handleHttpRequest } = require('../../../../adapters/network');
const { CommonUtils } = require('../../../../util/common');

const getRegion = (destination) => {
  // Check if deliveryAccount or accountDefinition is missing; if so, return region from Config
  if (!destination?.deliveryAccount?.accountDefinition) {
    return destination?.Config?.region;
  }
  // Extract region from deliveryAccount options
  const region = destination.deliveryAccount?.options?.region;
  // Throw error if region is not defined in deliveryAccount options
  if (!region) {
    throw new PlatformError('Region is not defined in delivery account options', 500);
  }
  // Return the region from deliveryAccount options
  return region;
};

const deduceModuleInfoV2 = (destination, destConfig) => {
  const { object, identifierMappings } = destConfig;
  const identifierType = identifierMappings.map(({ to }) => to);
  return {
    operationModuleType: object,
    upsertEndPoint: ZOHO_SDK.ZOHO.getBaseRecordUrl({
      dataCenter: getRegion(destination),
      moduleName: object,
    }),
    identifierType,
  };
};

function validatePresenceOfMandatoryPropertiesV2(objectName, object) {
  const { ZOHO } = ZOHO_SDK;
  const moduleWiseMandatoryFields = ZOHO.fetchModuleWiseMandatoryFields(objectName);
  if (isEmpty(moduleWiseMandatoryFields)) {
    return undefined;
  }
  // All the required field keys are mapped but we need to check they have values
  // We have this gurantee because the creation of the configuration doens't permit user to omit the mandatory fields
  const missingFields = moduleWiseMandatoryFields.filter(
    (field) => object.hasOwnProperty(field) && !isDefinedAndNotNullAndNotEmpty(object[field]),
  );

  return {
    status: missingFields.length > 0,
    missingField: missingFields,
  };
}

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

const handleDuplicateCheckV2 = (addDefaultDuplicateCheck, identifierType, operationModuleType) => {
  let additionalFields = [];

  if (addDefaultDuplicateCheck) {
    const { ZOHO } = ZOHO_SDK;
    additionalFields = ZOHO.fetchModuleWiseDuplicateCheckField(operationModuleType);
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

    const searchURL = ZOHO_SDK.ZOHO.getBaseRecordUrl({
      dataCenter: region,
      moduleName: 'coql',
    });
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

const searchRecordIdV2 = async ({ identifiers, metadata, destination, destConfig }) => {
  try {
    const region = getRegion(destination);
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
  deduceModuleInfoV2,
  validatePresenceOfMandatoryPropertiesV2,
  formatMultiSelectFieldsV2,
  handleDuplicateCheckV2,
  searchRecordIdV2,
  calculateTrigger,
  validateConfigurationIssue,
  getRegion,
};
