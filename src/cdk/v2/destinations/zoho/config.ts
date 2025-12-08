/**
 * Maximum number of records that can be sent in a single upsert batch to Zoho API.
 * This is the limit for the bulk upsert operation.
 */
export const MAX_BATCH_SIZE: number = 100;

/**
 * Maximum number of deletion events that can be processed in a single COQL query batch.
 * This aligns with Zoho's IN clause limit of 50 values per field.
 * Used for batched deletion lookups with IN/OR query optimization.
 */
export const COQL_BATCH_SIZE: number = 50;
