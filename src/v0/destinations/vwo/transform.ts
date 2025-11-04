/**
 * VWO Destination Transform Implementation
 * 
 * VWO (Visual Website Optimizer) is an A/B testing and conversion optimization platform.
 * This integration sends offline conversion events to VWO for tracking and analysis.
 * 
 * Supported operations:
 * - Track: Send custom events to VWO with event properties
 * 
 * Features:
 * - Multi-region support (DEFAULT, EU, AS)
 * - Offline conversion tracking
 * - Custom event properties
 * - Router pattern for batch processing
 */

import {
  InstrumentationError,
  ConfigurationError,
} from '@rudderstack/integrations-lib';
import {
  simpleProcessRouterDest,
  defaultRequestConfig,
  defaultPostRequestConfig,
} from '../../util';
import { JSON_MIME_TYPE } from '../../util/constant';

import { VWORouterRequest, VWODestination } from './types';
import { API_ENDPOINTS, DESTINATION_NAME, SUPPORTED_EVENT_TYPES } from './config';
import {
  buildVWOPayload,
  validateVWOEvent,
  getUserIdentifier,
  buildEndpoint,
} from './utils';

/**
 * Processes a single track event for VWO
 * 
 * Flow:
 * 1. Validates message type and required fields
 * 2. Validates destination configuration
 * 3. Constructs VWO event payload
 * 4. Builds API request with proper headers and endpoint
 * 
 * @param event - VWO router transformation request
 * @returns Transformed event ready for API submission
 */
const processEvent = (event: VWORouterRequest) => {
  const { message, destination } = event;

  // Validate message type
  if (!message.type) {
    throw new InstrumentationError('Message type is not present. Aborting message.');
  }

  // Only track events are supported
  if (message.type !== 'track') {
    throw new InstrumentationError(
      `Event type "${message.type}" is not supported. Only track events are supported.`,
    );
  }

  // Validate destination configuration
  const { accountId, region } = destination.Config;
  if (!accountId) {
    throw new ConfigurationError('Account ID is required but not provided');
  }

  // Validate required event fields
  validateVWOEvent(message);

  // Get user identifier
  const userId = getUserIdentifier(message);

  // Build VWO payload
  const payload = buildVWOPayload(message, userId);

  // Get API endpoint for the specified region
  const apiEndpoint = API_ENDPOINTS[region as keyof typeof API_ENDPOINTS] || API_ENDPOINTS.DEFAULT;

  // Construct event name for VWO
  const eventName = `rudderstack.${message.type}`;

  // Build the complete endpoint with query parameters
  const endpoint = buildEndpoint(apiEndpoint, accountId, eventName);

  // Create response object
  const response = defaultRequestConfig();
  response.method = defaultPostRequestConfig.requestMethod;
  response.endpoint = endpoint;
  response.headers = {
    'Content-Type': JSON_MIME_TYPE,
  };
  response.body.JSON = payload;
  response.userId = message.anonymousId;

  return response;
};

/**
 * Main processing function for single VWO events
 * 
 * This function is called for single event processing.
 * It validates and transforms the event for VWO's API.
 * 
 * @param event - VWO router transformation request
 * @returns Transformed event response
 */
const process = (event: VWORouterRequest) => {
  return processEvent(event);
};

/**
 * Router transformation function for batch VWO events
 * 
 * This function handles batch event processing using the simpleProcessRouterDest utility.
 * It processes multiple events efficiently and returns batched responses.
 * 
 * @param inputs - Array of VWO router transformation requests
 * @param reqMetadata - Request metadata for error handling
 * @returns Promise resolving to array of batched responses
 */
const processRouterDest = async (
  inputs: VWORouterRequest[],
  reqMetadata: Record<string, unknown>,
) => {
  const respList = await simpleProcessRouterDest(inputs, process, reqMetadata, {});
  return respList;
};

export { process, processRouterDest };

