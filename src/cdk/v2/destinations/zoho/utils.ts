import { BatchUtils } from '@rudderstack/workflow-engine';
import {
  getHashFromArray,
  isDefinedAndNotNull,
  PlatformError,
  isDefinedAndNotNullAndNotEmpty,
  removeUndefinedNullEmptyExclBoolInt,
  ZOHO_SDK,
} from '@rudderstack/integrations-lib';
import { isEmpty } from 'lodash';
import { isHttpStatusSuccess } from '../../../../v0/util';
import { handleHttpRequest } from '../../../../adapters/network';
import { CommonUtils } from '../../../../util/common';
import { Destination, FixMe } from '../../../../types';
import {
  DestConfig,
  SearchRecordParams,
  ProcessedCOQLAPISuccessResponse,
  ProcessedCOQLAPIErrorResponse,
  DeletionQueueItem,
} from './types';
import { COQL_BATCH_SIZE } from './config';

/**
 * Retrieves the Zoho region from the destination configuration.
 * Checks deliveryAccount options first, falls back to Config.region.
 *
 * @param {Destination} destination - The destination configuration object
 * @returns {string} The Zoho region (e.g., 'US', 'EU', 'IN', 'AU', 'JP')
 * @throws {PlatformError} If region is not defined in delivery account options
 */
const getRegion = (destination: Destination): string => {
  // Check if deliveryAccount or accountDefinition is missing; if so, return region from Config
  if (!destination?.deliveryAccount?.accountDefinition) {
    return destination?.Config?.region as string;
  }
  // Extract region from deliveryAccount options
  const region = destination.deliveryAccount?.options?.region;
  // Throw error if region is not defined in deliveryAccount options
  if (!region) {
    throw new PlatformError('Region is not defined in delivery account options', 500);
  }
  // Return the region from deliveryAccount options
  return region as string;
};

const deduceModuleInfoV2 = (destination: Destination, destConfig: DestConfig) => {
  const { object, identifierMappings } = destConfig;
  const identifierType = identifierMappings.map(({ to }) => to);
  return {
    operationModuleType: object,
    upsertEndPoint: ZOHO_SDK.ZOHO.getBaseRecordUrl({
      dataCenter: getRegion(destination) as FixMe,
      moduleName: object,
    }),
    identifierType,
  };
};

function validatePresenceOfMandatoryPropertiesV2(
  objectName: string,
  object: Record<string, unknown>,
) {
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

const formatMultiSelectFieldsV2 = (destConfig: DestConfig, fields: Record<string, unknown>) => {
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

const handleDuplicateCheckV2 = (
  addDefaultDuplicateCheck: unknown,
  identifierType: string[],
  operationModuleType: string,
) => {
  let additionalFields: string[] = [];

  if (addDefaultDuplicateCheck) {
    const { ZOHO } = ZOHO_SDK;
    additionalFields = ZOHO.fetchModuleWiseDuplicateCheckField(operationModuleType);
  }

  return Array.from(new Set([...identifierType, ...additionalFields]));
};

// Zoho has limitation that where clause should be formatted in a specific way
// ref: https://www.zoho.com/crm/developer/docs/api/v6/COQL-Limitations.html
const groupConditions = (conditions: string[]): string => {
  if (conditions.length === 1) {
    return conditions[0]; // No need for grouping with a single condition
  }
  if (conditions.length === 2) {
    return `(${conditions[0]} AND ${conditions[1]})`; // Base case
  }
  return `(${groupConditions(conditions.slice(0, 2))} AND ${groupConditions(conditions.slice(2))})`;
};

/**
 * Groups conditions with OR operator using Zoho COQL nested grouping convention.
 * Recursively creates nested parentheses: (A OR (B OR C)) or ((A OR B) OR C).
 * Required by Zoho COQL - flat format (A OR B OR C) is not allowed.
 *
 * @param {string[]} conditions - Array of condition strings to group with OR
 * @returns {string} Nested OR condition string with proper parentheses
 *
 * @example
 * groupConditionsWithOR(['A', 'B', 'C']) // Returns: "(A OR (B OR C))"
 * groupConditionsWithOR(['A', 'B']) // Returns: "(A OR B)"
 * groupConditionsWithOR(['A']) // Returns: "A"
 */
const groupConditionsWithOR = (conditions) => {
  if (conditions.length === 1) {
    return conditions[0]; // No need for grouping with a single condition
  }
  if (conditions.length === 2) {
    return `(${conditions[0]} OR ${conditions[1]})`; // Base case
  }
  return `(${groupConditionsWithOR(conditions.slice(0, 2))} OR ${groupConditionsWithOR(conditions.slice(2))})`;
};

// supported data type in where clause
// ref: https://help.zoho.com/portal/en/kb/creator/developer-guide/forms/add-and-manage-fields/articles/understand-fields#Types_of_fields
// ref: https://www.zoho.com/crm/developer/docs/api/v6/Get-Records-through-COQL-Query.html
const generateWhereClause = (fields: Record<string, unknown>) => {
  const cleanedFields = removeUndefinedNullEmptyExclBoolInt(fields) as Record<string, unknown>;
  const conditions = Object.keys(cleanedFields).map((key) => {
    const value = cleanedFields[key];
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

const generateSqlQuery = (module: string, fields: Record<string, unknown>) => {
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

/**
 * Sends a COQL (CRM Object Query Language) request to Zoho API to search for records.
 * Handles API errors, empty results, and returns normalized response format.
 *
 * @param {string | undefined} region - Zoho region (e.g., 'US', 'EU')
 * @param {string} accessToken - Zoho OAuth access token
 * @param {string} object - Zoho module name (e.g., 'Leads', 'Contacts')
 * @param {string} selectQuery - COQL SELECT query string
 * @returns {Promise<ProcessedCOQLAPISuccessResponse | ProcessedCOQLAPIErrorResponse>} Normalized response with records or error
 */
const sendCOQLRequest = async (
  region: string | undefined,
  accessToken: string,
  object: string,
  selectQuery: string,
): Promise<ProcessedCOQLAPISuccessResponse | ProcessedCOQLAPIErrorResponse> => {
  if (selectQuery === '') {
    return {
      status: false,
      message: `Identifier values are not provided for ${object}`,
    };
  }

  const searchURL = ZOHO_SDK.ZOHO.getBaseRecordUrl({
    dataCenter: region as FixMe,
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

  const { status, response } = searchResult.processedResponse;
  if (!isHttpStatusSuccess(status)) {
    return {
      status: false,
      apiStatus: status,
      apiResponse: response,
    };
  }

  if (status === 204 || !CommonUtils.isNonEmptyArray(response?.data)) {
    return {
      status: false,
      message: `No ${object} is found for record identifier`,
      apiResponse: response.data,
      apiStatus: status,
    };
  }

  return {
    status: true,
    records: response.data,
  };
};

const searchRecordIdV2 = async ({
  identifiers,
  metadata,
  destination,
  destConfig,
}: SearchRecordParams): Promise<
  ProcessedCOQLAPISuccessResponse | ProcessedCOQLAPIErrorResponse
> => {
  try {
    const region = getRegion(destination);
    const { object } = destConfig;

    const selectQuery = generateSqlQuery(object, identifiers);
    const result = await sendCOQLRequest(region, metadata.secret.accessToken, object, selectQuery);
    return result;
  } catch (error: any) {
    return {
      status: false,
      message: error.message,
    };
  }
};

// ============================================================================
// Batched Deletion with IN/OR + Post-Filter Approach
// ============================================================================

/**
 * Determines if batched deletion lookup is enabled for a given workspace.
 * Uses ZOHO_DELETION_BATCHING_LOOKUP environment variable as a feature flag.
 * If env var is not set or empty, batching is enabled by default.
 * If env var is set, only workspaces in the comma-separated list get batching.
 *
 * @param {string} workspaceId - The workspace ID to check
 * @returns {boolean} True if batched deletion lookup should be used, false for legacy one-by-one approach
 *
 * @example
 * // Env: ZOHO_DELETION_BATCHING_LOOKUP="workspace1,workspace2"
 * isDeletionLookupBatchingEnabled('workspace1') // Returns: true
 * isDeletionLookupBatchingEnabled('workspace3') // Returns: false
 *
 */
const isDeletionLookupBatchingEnabled = (workspaceId) => {
  // If no workspaceId provided (tests or legacy behavior), disable batching
  if (!workspaceId) {
    return false;
  }

  // Check if this workspace is in the feature flag list
  const zohoDeletionBatchingLookup = process.env.ZOHO_DELETION_BATCHING_LOOKUP?.split(',')?.map?.(
    (s) => s?.trim?.(),
  );

  // If env var not set, enable batching by default for backward compatibility
  if (!zohoDeletionBatchingLookup || zohoDeletionBatchingLookup.length === 0) {
    return true;
  }

  return zohoDeletionBatchingLookup.includes(workspaceId);
};

/**
 * Builds a COQL query using IN/OR operators to fetch a superset of records
 * that will be filtered for exact matches in application code.
 *
 * @param {string} module - Zoho module name (e.g., 'Leads', 'Contacts')
 * @param {Array<Object>} filters - Array of identifier objects
 * @param {Array<string>} identifierFields - List of identifier field names to include in SELECT
 * @returns {string} COQL query string with IN/OR clauses
 *
 * @example
 * filters = [
 *   { Email: 'a@test.com', Phone: '123' },
 *   { Email: 'b@test.com', Phone: '456' }
 * ]
 * identifierFields = ['Email', 'Phone']
 *
 * Returns: "SELECT id, Email, Phone FROM Leads WHERE (Email in ('a@test.com', 'b@test.com') OR Phone in ('123', '456'))"
 */
const buildBatchedCOQLQueryWithIN = (
  module: string,
  filters: Record<string, unknown>[],
  identifierFields: string[],
): string => {
  if (filters.length === 0) return '';

  // Collect unique values per field across all filters
  const fieldValues: Record<string, Set<unknown>> = {};
  filters.forEach((filter) => {
    Object.entries(filter).forEach(([field, value]) => {
      if (value !== null && value !== undefined && value !== '') {
        if (!fieldValues[field]) fieldValues[field] = new Set();

        // Handle different value types
        if (Array.isArray(value)) {
          fieldValues[field].add(value.join(';'));
        } else {
          fieldValues[field].add(value);
        }
      }
    });
  });

  if (Object.keys(fieldValues).length === 0) return '';

  // Build IN clauses for each field
  const inClauses = Object.entries(fieldValues).map(([field, valuesSet]) => {
    const values = Array.from(valuesSet);

    // Zoho IN clause limit is 50 values - take first 50 if exceeded
    const limitedValues = values.slice(0, 50);

    const valueList = limitedValues
      .map((v) => {
        // Numbers don't need quotes
        if (typeof v === 'number') return v;
        // Strings need quotes, escape any quotes in the string
        return `'${String(v).replace(/'/g, "\\'")}'`;
      })
      .join(', ');

    return `${field} in (${valueList})`;
  });

  // Combine IN clauses with OR using Zoho's nested grouping convention
  // Must be: (A OR (B OR C)) or ((A OR B) OR C) - not (A OR B OR C)
  const whereClause = groupConditionsWithOR(inClauses);

  // Include identifier fields in SELECT for result mapping
  const selectFields = ['id', ...identifierFields].join(', ');

  return `SELECT ${selectFields} FROM ${module} WHERE ${whereClause}`;
};

/**
 * Filters COQL results to return only exact matches based on original filter criteria.
 * This is the post-filtering step of the Hybrid approach.
 *
 * @param {Array<Object>} records - Records returned from COQL (superset)
 * @param {Array<Object>} filters - Original filter criteria (exact matches needed)
 * @returns {Array<Object>} Records that exactly match at least one filter
 *
 * @example
 * records = [
 *   { id: 'R1', Email: 'a@test.com', Phone: '123' },
 *   { id: 'R2', Email: 'a@test.com', Phone: '456' },
 *   { id: 'R3', Email: 'b@test.com', Phone: '456' }
 * ]
 * filters = [
 *   { Email: 'a@test.com', Phone: '123' },
 *   { Email: 'b@test.com', Phone: '456' }
 * ]
 *
 * Returns: [R1, R3] (R2 excluded because Email='a' but Phone='456' doesn't match any filter)
 */
const filterExactMatches = (records, filters): Array<Record<string, string>> =>
  records.filter((record) =>
    filters.some((filter) =>
      Object.entries(filter).every(([field, value]) => {
        const recordValue = record[field];

        // Handle different value types
        if (Array.isArray(value)) {
          // Array values are stored as semicolon-separated in Zoho
          const joinedValue = value.join(';');
          return recordValue === joinedValue;
        }

        // Direct comparison for strings and numbers
        return recordValue === value;
      }),
    ),
  );

/**
 * Creates a unique hash key from identifier values for matching records to events.
 *
 * @param {Object} identifiers - Identifier object (e.g., {Email: 'a@test.com', Phone: '123'})
 * @returns {string} Hash key (e.g., "Email:a@test.com|Phone:123")
 */
const createIdentifierKey = (identifiers: Record<string, unknown>): string => {
  const cleaned = removeUndefinedNullEmptyExclBoolInt(identifiers) as Record<string, unknown>;
  const sortedKeys = Object.keys(cleaned).sort();

  return sortedKeys
    .map((key) => {
      const value = cleaned[key];
      // Handle arrays by joining
      if (Array.isArray(value)) {
        return `${key}:${value.join(';')}`;
      }
      return `${key}:${value}`;
    })
    .join('|');
};

/**
 * Maps COQL results back to individual events using exact matching.
 *
 * @param {Array<Object>} eventBatch - Batch of deletion events with identifiers
 * @param {Array<Object>} records - Filtered records from COQL (already exact matches)
 * @param {string} module - Zoho module name for error messages
 * @returns {Object} { successMap: {eventIndex: [recordIds]}, errorMap: {eventIndex: error} }
 */
const mapCOQLResultsToEvents = (eventBatch, records, module) => {
  const successMap = {};
  const errorMap = {};

  // Build lookup map: identifierKey -> [recordIds]
  const recordsByKey = {};
  records.forEach((record) => {
    // Extract identifier fields from record (exclude 'id')
    const identifiers = { ...record };
    delete identifiers.id;

    const key = createIdentifierKey(identifiers);
    if (!recordsByKey[key]) {
      recordsByKey[key] = [];
    }
    recordsByKey[key].push(record.id);
  });

  // Match events to records
  eventBatch.forEach((event) => {
    const key = createIdentifierKey(event.identifiers);

    if (recordsByKey[key]) {
      successMap[event.eventIndex] = recordsByKey[key];
    } else {
      errorMap[event.eventIndex] = {
        status: false,
        message: `No ${module} is found for record identifier ${key}`,
      };
    }
  });

  return { successMap, errorMap };
};

/**
 * Executes a single batched COQL query with IN/OR clauses and filters results.
 *
 * @param {BatchedCOQLQueryParams} params - Query parameters
 * @param {Array<DeletionQueueItem>} params.eventBatch - Batch of deletion events (max 50)
 * @param {string} params.region - Zoho region
 * @param {string} params.accessToken - Zoho access token
 * @param {string} params.module - Zoho module name
 * @param {Array<string>} params.identifierFields - List of identifier field names
 * @returns {Promise<ProcessedCOQLAPIResponse>} Response containing records or error information
 */
const executeBatchedCOQLQuery = async ({
  selectQuery,
  region,
  accessToken,
}: {
  selectQuery: string;
  region: string;
  accessToken: string;
}): Promise<ProcessedCOQLAPISuccessResponse | ProcessedCOQLAPIErrorResponse> => {
  const searchURL = ZOHO_SDK.ZOHO.getBaseRecordUrl({
    dataCenter: region as FixMe, // Type assertion: region is validated by getRegion()
    moduleName: 'coql',
  });

  const searchResult = await handleHttpRequest(
    'post',
    searchURL,
    { select_query: selectQuery },
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

  const { status, response } = searchResult.processedResponse;

  // Handle non-success status codes
  if (!isHttpStatusSuccess(status)) {
    return {
      message: response,
      status: false,
      apiStatus: status,
      apiResponse: response,
    };
  }

  // Handle empty results (204 or no data)
  if (status === 204 || !CommonUtils.isNonEmptyArray(response?.data)) {
    return {
      status: true,
      records: [], // Empty results - will be handled by mapping
    };
  }

  return {
    status: true,
    records: response.data,
  };
};

/**
 * Main orchestrator for batched COQL searches with IN/OR + Post-Filter approach.
 * Processes deletion events in batches of up to 50 (Zoho IN clause limit).
 * All batches are processed in parallel using Promise.all for improved performance.
 *
 * @param {Array<Object>} deletionQueue - Array of queued deletion events
 * @param {string} region - Zoho region
 * @param {string} accessToken - Zoho access token
 * @param {string} module - Zoho module name
 * @param {Array<string>} identifierFields - List of identifier field names
 * @returns {Object} { successMap: {eventIndex: [recordIds]}, errorMap: {eventIndex: error} }
 */
const batchedSearchRecordIds = async ({
  deletionQueue,
  region,
  accessToken,
  module,
  identifierFields,
}: {
  deletionQueue: DeletionQueueItem[];
  region: string;
  accessToken: string;
  module: string;
  identifierFields: string[];
}) => {
  const successMap = {};
  const errorMap = {};

  // Split into batches based on COQL_BATCH_SIZE (default 50 for IN clause limit)
  const batches = BatchUtils.chunkArrayBySizeAndLength(deletionQueue, {
    maxItems: COQL_BATCH_SIZE,
  });

  // Process all batches in parallel using Promise.all
  const batchPromises = batches.items.map(async (batch) => {
    const identifiersList = batch.map<Record<string, string>>((event) => event.identifiers);

    const selectQuery = buildBatchedCOQLQueryWithIN(module, identifiersList, identifierFields);

    const result: ProcessedCOQLAPISuccessResponse | ProcessedCOQLAPIErrorResponse =
      selectQuery === ''
        ? {
            status: false,
            message: `Identifier values are not provided for ${module}`,
          }
        : await executeBatchedCOQLQuery({
            selectQuery,
            region,
            accessToken,
          });

    return {
      batch,
      identifiersList,
      result,
    };
  });

  // Wait for all batch queries to complete
  const batchResults = await Promise.all(batchPromises);

  // Process results and build success/error maps
  batchResults.forEach(({ batch, identifiersList, result }) => {
    if (result.status) {
      const filteredRecords = filterExactMatches(result.records, identifiersList);
      // Map filtered results to individual events
      const mapped = mapCOQLResultsToEvents(batch, filteredRecords, module);
      Object.assign(successMap, mapped.successMap);
      Object.assign(errorMap, mapped.errorMap);
    } else {
      batch.forEach((event) => {
        errorMap[event.eventIndex] = result;
      });
    }
  });

  return { successMap, errorMap };
};

// ref : https://www.zoho.com/crm/developer/docs/api/v6/upsert-records.html#:~:text=The%20trigger%20input%20can%20be%20workflow%2C%20approval%2C%20or%20blueprint.%20If%20the%20trigger%20is%20not%20mentioned%2C%20the%20workflows%2C%20approvals%20and%20blueprints%20related%20to%20the%20API%20will%20get%20executed.%20Enter%20the%20trigger%20value%20as%20%5B%5D%20to%20not%20execute%20the%20workflows.
const calculateTrigger = (trigger: unknown) => {
  if (trigger === 'Default') {
    return null;
  }
  if (trigger === 'None') {
    return [];
  }
  return [trigger];
};

export {
  deduceModuleInfoV2,
  validatePresenceOfMandatoryPropertiesV2,
  formatMultiSelectFieldsV2,
  handleDuplicateCheckV2,
  searchRecordIdV2,
  calculateTrigger,
  getRegion,
  // Batched deletion functions (IN/OR + Post-Filter approach)
  isDeletionLookupBatchingEnabled,
  batchedSearchRecordIds,
  buildBatchedCOQLQueryWithIN,
  filterExactMatches,
  createIdentifierKey,
};
