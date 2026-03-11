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
  COQLResultMapping,
  ZohoRouterIORequest,
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

/**
 * Deduces module information required for Zoho operations.
 * Extracts object name, identifier types, and constructs the upsert endpoint URL.
 *
 * @param {Destination} destination - The destination configuration object
 * @param {DestConfig} destConfig - The destination-specific configuration
 * @returns {Object} Module info containing operationModuleType, upsertEndPoint, and identifierType array
 */
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

/**
 * Validates that all mandatory fields for a Zoho module have non-empty values.
 * Checks against module-specific required fields defined in Zoho SDK.
 *
 * @param {string} objectName - Zoho module name (e.g., 'Leads', 'Contacts')
 * @param {Record<string, unknown>} object - The record object to validate
 * @returns {Object | undefined} Validation result with status and missingField array, or undefined if no mandatory fields
 */
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

/**
 * Formats multi-select fields by wrapping their values in arrays as required by Zoho API.
 * Uses configuration mapping to identify which fields need array wrapping.
 *
 * @param {DestConfig} destConfig - The destination-specific configuration
 * @param {Record<string, unknown>} fields - The fields object to format
 * @returns {Record<string, unknown>} Formatted fields with multi-select values wrapped in arrays
 */
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

/**
 * Determines which fields to use for duplicate checking during upsert operations.
 * Combines identifier fields with module-specific duplicate check fields if enabled.
 *
 * @param {unknown} addDefaultDuplicateCheck - Flag to enable module-specific duplicate check fields
 * @param {string[]} identifierType - Array of identifier field names
 * @param {string} operationModuleType - Zoho module name (e.g., 'Leads', 'Contacts')
 * @returns {string[]} Deduplicated array of field names to use for duplicate checking
 */
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

/**
 * Groups conditions with AND operator using Zoho COQL nested grouping convention.
 * Recursively creates nested parentheses: ((A AND B) AND C).
 * Required by Zoho COQL - flat format (A AND B AND C) is not allowed.
 *
 * @param {string[]} conditions - Array of condition strings to group with AND
 * @returns {string} Nested AND condition string with proper parentheses
 * @see https://www.zoho.com/crm/developer/docs/api/v6/COQL-Limitations.html
 *
 * @example
 * groupConditions(['A', 'B', 'C']) // Returns: "(A AND (B AND C))"
 * groupConditions(['A', 'B']) // Returns: "(A AND B)"
 * groupConditions(['A']) // Returns: "A"
 */
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
 * Recursively creates nested parentheses: ((A OR B) OR C).
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
const groupConditionsWithOR = (conditions: string[]) => {
  if (conditions.length === 1) {
    return conditions[0]; // No need for grouping with a single condition
  }
  if (conditions.length === 2) {
    return `(${conditions[0]} OR ${conditions[1]})`; // Base case
  }
  return `(${groupConditionsWithOR(conditions.slice(0, 2))} OR ${groupConditionsWithOR(conditions.slice(2))})`;
};

/**
 * Generates a WHERE clause for COQL queries from field-value pairs.
 * Handles different data types (strings, numbers, arrays) according to Zoho COQL syntax.
 * Cleans input by removing undefined, null, and empty values.
 *
 * @param {Record<string, unknown>} fields - Field-value pairs to convert to WHERE conditions
 * @returns {string} WHERE clause with nested AND conditions, or empty string if no valid fields
 * @see https://help.zoho.com/portal/en/kb/creator/developer-guide/forms/add-and-manage-fields/articles/understand-fields#Types_of_fields
 * @see https://www.zoho.com/crm/developer/docs/api/v6/Get-Records-through-COQL-Query.html
 *
 * @example
 * generateWhereClause({ Email: 'test@example.com', Phone: '123' })
 * // Returns: "WHERE (Email = 'test@example.com' AND Phone = '123')"
 */
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

/**
 * Generates a complete COQL SELECT query to find record IDs by identifier fields.
 * Limits fields to first 25 to avoid Zoho API restrictions.
 *
 * @param {string} module - Zoho module name (e.g., 'Leads', 'Contacts')
 * @param {Record<string, unknown>} fields - Identifier field-value pairs
 * @returns {string} Complete COQL query string or empty string if no valid WHERE clause
 *
 * @example
 * generateSqlQuery('Leads', { Email: 'test@example.com', Phone: '123' })
 * // Returns: "SELECT id FROM Leads WHERE (Email = 'test@example.com' AND Phone = '123')"
 */
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
 * @param {string} selectQuery - COQL SELECT query string
 * @param {object} options - Optional configuration
 * @param {string} options.moduleName - Zoho module name for error messages (optional)
 * @param {boolean} options.returnEmptyOnNoResults - Return empty array instead of error for no results
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
      errorType: 'instrumentation',
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
      errorType: 'instrumentation',
      message: `No ${object} is found for record identifier`,
      apiStatus: status,
      apiResponse: response,
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

// Check if this workspace is in the feature flag list
const zohoBatchDeletionLookupWorkspaces =
  process.env.DEST_ZOHO_DELETION_BATCHING_SUPPORTED_WORKSPACE_IDS?.split(',')?.map?.((s) =>
    s?.trim?.(),
  );
/**
 * Determines if batched deletion lookup is enabled for a given workspace.
 * Uses DEST_ZOHO_DELETION_BATCHING_SUPPORTED_WORKSPACE_IDS environment variable as a feature flag.
 * If env var is not set or empty, batching is disabled by default.
 * If env var is set, only workspaces in the comma-separated list get batching.
 *
 * @param {string} workspaceId - The workspace ID to check
 * @returns {boolean} True if batched deletion lookup should be used, false for legacy one-by-one approach
 *
 * @example
 * // Env: DEST_ZOHO_DELETION_BATCHING_SUPPORTED_WORKSPACE_IDS="workspace1,workspace2"
 * isDeletionLookupBatchingEnabled('workspace1') // Returns: true
 * isDeletionLookupBatchingEnabled('workspace3') // Returns: false
 *
 */
const isDeletionLookupBatchingEnabled = (workspaceId: string | undefined) => {
  // If no workspaceId provided (tests or legacy behavior), disable batching
  if (!workspaceId) {
    return false;
  }

  // If env var not set, disable batching by default for backward compatibility
  if (!zohoBatchDeletionLookupWorkspaces || zohoBatchDeletionLookupWorkspaces.length === 0) {
    return false;
  }

  return zohoBatchDeletionLookupWorkspaces.includes(workspaceId);
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

  // Collect unique values per field across all filters (only for identifier fields)
  const fieldValues: Record<string, Set<unknown>> = {};
  filters.forEach((filter) => {
    Object.entries(filter).forEach(([field, value]) => {
      // Only process fields that are in identifierFields
      if (
        identifierFields.includes(field) &&
        value !== null &&
        value !== undefined &&
        value !== ''
      ) {
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

    const valueList = values
      .map((v) => {
        // Numbers don't need quotes
        if (typeof v === 'number') return v;
        // Escape backslashes first, then single quotes
        return `'${String(v).replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'`;
      })
      .join(', ');

    return `${field} in (${valueList})`;
  });

  // Combine IN clauses with OR using Zoho's nested grouping convention
  // Must be: (A OR (B OR C)) or ((A OR B) OR C) - not (A OR B OR C)
  const whereClause = groupConditionsWithOR(inClauses);

  // Include identifier fields in SELECT for result mapping
  const selectFields = identifierFields.includes('id')
    ? identifierFields.join(', ')
    : ['id', ...identifierFields].join(', ');

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
const filterExactMatches = (
  records: Array<Record<string, unknown>>,
  filters: Array<Record<string, unknown>>,
): Array<Record<string, unknown>> =>
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
 * Creates a lookup map by identifier hash and matches each event to its corresponding record IDs.
 *
 * @param {DeletionQueueItem[]} eventBatch - Batch of deletion events with identifiers and event indexes
 * @param {Array<Record<string, string>>} records - Filtered records from COQL (already exact matches)
 * @param {string} module - Zoho module name for error messages
 * @returns {COQLResultMapping} Result object with successMap (eventIndex -> recordIds[]) and errorMap (eventIndex -> error)
 *
 * @example
 * eventBatch = [
 *   { eventIndex: 0, identifiers: { Email: 'a@test.com', Phone: '123' } },
 *   { eventIndex: 1, identifiers: { Email: 'b@test.com', Phone: '456' } }
 * ]
 * records = [
 *   { id: 'R1', Email: 'a@test.com', Phone: '123' },
 *   { id: 'R2', Email: 'b@test.com', Phone: '456' }
 * ]
 * Returns: {
 *   successMap: { 0: ['R1'], 1: ['R2'] },
 *   errorMap: {}
 * }
 */
const mapCOQLResultsToEvents = (
  eventBatch: ZohoRouterIORequest[],
  records: Array<Record<string, unknown>>,
  module: string,
): COQLResultMapping => {
  const successMap: Record<number, string[]> = {};
  const errorMap: Record<number, ProcessedCOQLAPIErrorResponse> = {};

  // Build lookup map: identifierKey -> [recordIds]
  const recordsByKey: Record<string, string[]> = {};
  records.forEach((record) => {
    // Extract identifier fields from record (exclude 'id')
    const identifiers = { ...record };
    delete identifiers.id;

    const key = createIdentifierKey(identifiers);
    if (!recordsByKey[key]) {
      recordsByKey[key] = [];
    }
    recordsByKey[key].push(record.id as string);
  });

  // Match events to records
  eventBatch.forEach((event) => {
    const identifiers = event.message.identifiers as Record<string, unknown>;
    const {
      metadata: { jobId },
    } = event;
    const key = createIdentifierKey(identifiers);

    if (recordsByKey[key]) {
      successMap[jobId] = recordsByKey[key];
    } else {
      errorMap[jobId] = {
        status: false,
        message: `No ${module} is found for record identifier ${key}`,
      };
    }
  });

  return { successMap, errorMap };
};

/**
 * Chunks deletion queue based on whichever identifier field hits the limit of unique values first.
 * Iterates through events and adds them to current batch until ANY identifier field reaches exactly the max unique values limit,
 * then starts a new batch.
 *
 * **Important Note**: The event that causes a field to reach the limit is included in the current batch,
 * then a new batch starts fresh. Each batch will have at most maxValuesPerField unique values for any given field.
 * The limit is never exceeded because only new unique values are counted via Set.add().
 *
 * @param {ZohoRouterIORequest[]} deletionQueue - Queue of deletion events with identifiers
 * @param {number} maxValuesPerField - Maximum unique values per field (default: 50 for Zoho IN clause)
 * @returns {ZohoRouterIORequest[][]} Array of batches, each respecting the identifier limit
 *
 * @example
 * // Events with Email and Phone identifiers
 * // If Phone reaches exactly 50 unique values at event 60, that event is included in current batch, then new batch starts
 * // Batch 1: Events 1-60 (Phone has exactly 50 unique values, Email has 30)
 * // Batch 2: Events 61-N (starts fresh with empty tracking)
 */
const chunkByIdentifierLimit = (
  deletionQueue: ZohoRouterIORequest[],
  maxValuesPerField: number = COQL_BATCH_SIZE,
): ZohoRouterIORequest[][] => {
  // Handle empty queue early
  if (deletionQueue.length === 0) return [];

  // Initialize batch tracking
  const batches: ZohoRouterIORequest[][] = []; // Final array of batches to return
  let currentBatch: ZohoRouterIORequest[] = []; // Current batch being built
  let currentFieldValues: Record<string, Set<unknown>> = {}; // Track unique values per field in current batch

  // Flag to track if current event caused any field to hit the limit
  let wouldExceedLimit = false;

  deletionQueue.forEach((event) => {
    // Extract identifiers from the current event
    const identifiers = event.message.identifiers as Record<string, unknown>;

    // Process each identifier field (e.g., Email, Phone, etc.)
    Object.entries(identifiers).forEach(([field, value]) => {
      if (isDefinedAndNotNullAndNotEmpty(value)) {
        // Initialize Set for this field if first time seeing it in current batch
        if (!currentFieldValues[field]) {
          currentFieldValues[field] = new Set();
        }

        // Normalize arrays to semicolon-separated strings (Zoho format)
        const normalizedValue = Array.isArray(value) ? value.join(';') : value;

        // Add to Set (Set automatically handles duplicates - won't add if already exists)
        currentFieldValues[field].add(normalizedValue);

        // Check if adding this value caused the field to reach the limit
        if (currentFieldValues[field].size >= maxValuesPerField) {
          wouldExceedLimit = true;
        }
      }
    });

    // Add current event to the batch (BEFORE checking if we need to finalize)
    // This means the event that triggers the limit IS included in the current batch
    currentBatch.push(event);

    // If limit reached, finalize current batch and start fresh
    if (wouldExceedLimit && currentBatch.length > 0) {
      batches.push(currentBatch); // Save completed batch
      currentBatch = []; // Start new empty batch
      currentFieldValues = {}; // Reset field tracking for new batch
      wouldExceedLimit = false; // Reset flag
    }
  });

  // Add the last batch if it has any events
  if (currentBatch.length > 0) {
    batches.push(currentBatch);
  }

  return batches;
};

/**
 * Main orchestrator for batched COQL searches using IN/OR + Post-Filter approach.
 *
 * **Batching Strategy:**
 * - Chunks deletion queue based on unique identifier values, NOT event count
 * - Creates new batch when ANY identifier field reaches 50 unique values
 * - This respects Zoho's IN clause limit of 50 values per field
 *
 * @param {Object} params - Search parameters
 * @param {Array<DeletionQueueItem>} params.deletionQueue - Queue of deletion events with identifiers and event indexes
 * @param {string} params.region - Zoho region (e.g., 'US', 'EU')
 * @param {string} params.accessToken - Zoho OAuth access token
 * @param {string} params.module - Zoho module name (e.g., 'Leads', 'Contacts')
 * @param {Array<string>} params.identifierFields - List of identifier field names for SELECT clause
 * @returns {Promise<Object>} Result object with successMap (eventIndex -> recordIds[]) and errorMap (eventIndex -> error)
 *
 * @example
 * // Example with 2 events in 1 batch (both identifiers well under limit)
 * const result = await batchedSearchRecordIds({
 *   deletionQueue: [
 *     { eventIndex: 0, input: { message: { identifiers: { Email: 'a@test.com', Phone: '123' } } } },
 *     { eventIndex: 1, input: { message: { identifiers: { Email: 'b@test.com', Phone: '456' } } } }
 *   ],
 *   region: 'US',
 *   accessToken: 'token123',
 *   module: 'Leads',
 *   identifierFields: ['Email', 'Phone']
 * });
 * // Returns: { successMap: { 0: ['id1'], 1: ['id2'] }, errorMap: {} }
 *
 * @example
 * // Example with 100 events batched into 2 queries (phone hits 50 unique values)
 * const result = await batchedSearchRecordIds({
 *   deletionQueue: [
 *     // 100 events with 10 unique emails, 100 unique phones
 *     // Batch 1: First 50 events (Phone: 0-49, Email repeating)
 *     // Batch 2: Next 50 events (Phone: 50-99, Email repeating)
 *   ],
 *   region: 'US',
 *   accessToken: 'token123',
 *   module: 'Leads',
 *   identifierFields: ['Email', 'Phone']
 * });
 * // Returns: { successMap: { 0: ['id1'], 1: ['id2'], ... }, errorMap: {} }
 */
const batchedSearchRecordIds = async ({
  deletionQueue,
  region,
  accessToken,
  module,
  identifierFields,
}: {
  deletionQueue: ZohoRouterIORequest[];
  region: string;
  accessToken: string;
  module: string;
  identifierFields: string[];
}) => {
  const successMap = {};
  const errorMap = {};

  // Split into batches based on whichever identifier field hits 50 unique values first
  const batches = chunkByIdentifierLimit(deletionQueue, COQL_BATCH_SIZE);

  // Process all batches in parallel using Promise.all
  const batchPromises = batches.map(async (batch) => {
    const identifiersList = batch.map(
      (event) => event.message.identifiers as Record<string, unknown>,
    );

    const selectQuery = buildBatchedCOQLQueryWithIN(module, identifiersList, identifierFields);

    const result: ProcessedCOQLAPISuccessResponse | ProcessedCOQLAPIErrorResponse =
      selectQuery === ''
        ? {
            status: false,
            errorType: 'instrumentation',
            message: `Identifier values are not provided for ${module}`,
          }
        : await sendCOQLRequest(region, accessToken, module, selectQuery);

    // Convert 204/empty responses to empty success results
    // But preserve actual API errors (401, 500, etc.) to be handled as errors
    if (result.status === false && result.apiStatus === 204) {
      return {
        batch,
        identifiersList,
        result: {
          status: true,
          records: [], // Empty results - will be handled by mapping
        },
      };
    }
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
        const {
          metadata: { jobId },
        } = event;
        errorMap[jobId] = result;
      });
    }
  });

  return { successMap, errorMap };
};

/**
 * Calculates the trigger parameter for Zoho API requests based on configuration.
 * Controls which workflows, approvals, and blueprints are executed during the operation.
 *
 * @param {unknown} trigger - Trigger configuration value ('Default', 'None', or specific trigger name)
 * @returns {null | Array | string} Trigger value for API request:
 *   - null: Execute all workflows/approvals/blueprints (when 'Default')
 *   - []: Skip all workflows (when 'None')
 *   - [trigger]: Execute specific trigger only
 * @see https://www.zoho.com/crm/developer/docs/api/v6/upsert-records.html
 *
 * @example
 * calculateTrigger('Default') // Returns: null (execute all)
 * calculateTrigger('None') // Returns: [] (skip all)
 * calculateTrigger('workflow') // Returns: ['workflow'] (execute specific)
 */
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
  chunkByIdentifierLimit,
};
