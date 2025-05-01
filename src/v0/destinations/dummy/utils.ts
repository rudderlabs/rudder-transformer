/**
 * Utility functions for the dummy destination
 */
import lodash from 'lodash';

import { defaultRequestConfig, defaultPostRequestConfig } from '../../util';
import { ENDPOINT, MAX_BATCH_SIZE, DEFAULT_BATCH_SIZE } from './config';
import { JSON_MIME_TYPE } from '../../util/constant';

/**
 * Builds a response for the dummy destination
 * @param payload - The payload to send (can be a single payload or an object with events array)
 * @param message - The original message
 * @returns The response object
 */
export function buildResponse(payload: Record<string, any>) {
  const response = defaultRequestConfig();

  // Set endpoint
  response.endpoint = ENDPOINT;

  // Set headers
  response.headers = {
    'Content-Type': JSON_MIME_TYPE,
    'X-Dummy-Destination': 'true',
  };

  // Set method
  response.method = defaultPostRequestConfig.requestMethod;

  // Set body
  // If payload contains an events array, it's a batch of payloads
  response.body.JSON = payload;

  // Set status code
  response.statusCode = 200;

  return response;
}

/**
 * Batch events for the dummy destination
 * @param events - The events to batch
 * @param batchSize - The batch size to use
 * @returns The batched events
 */
export function batchEvents(
  events: Record<string, any>[],
  batchSize: number = DEFAULT_BATCH_SIZE,
): Record<string, any>[][] {
  // If no events, return empty array
  if (!events || events.length === 0) {
    return [];
  }

  // Use the provided batch size or default
  const actualBatchSize = Math.min(batchSize, MAX_BATCH_SIZE);

  // Create batches for each destination
  const batches: Record<string, any>[][] = lodash.chunk(events, actualBatchSize);

  return batches;
}
