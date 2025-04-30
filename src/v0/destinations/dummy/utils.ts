/**
 * Utility functions for the dummy destination
 */

import { defaultRequestConfig, defaultPostRequestConfig } from '../../util';
import { ENDPOINT } from './config';
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
