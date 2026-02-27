/**
 * Survicate Destination Integration
 * Transforms RudderStack events (identify, group, track) to Survicate API format
 *
 * Supported events:
 * - identify: Send user identification data
 * - group: Associate users with groups
 * - track: Track user events
 */

import { ConfigurationError, InstrumentationError } from '@rudderstack/integrations-lib';
import { defaultRequestConfig, simpleProcessRouterDest } from '../../util';
import {
  SurvicateRouterRequest,
  SurvicateDestinationConfig,
  SurvicateMessage,
} from './types';
import { ENDPOINT_CONFIG } from './config';

/**
 * Process identify event
 * Sends user identification data to Survicate
 *
 * Endpoint: POST /endpoint/rudder-stack/identify
 *
 * @param message - The RudderStack message
 * @param destinationConfig - The destination configuration
 * @returns Formatted HTTP response
 */
const processIdentifyEvent = (
  message: SurvicateMessage,
  destinationConfig: SurvicateDestinationConfig,
) => {
  // Skip anonymous calls - we only accept identified users
  if (!message.userId) {
    throw new InstrumentationError(
      'Anonymous identify calls are not supported. userId is required.',
    );
  }

  // Build the payload - flatten traits and include context properties
  const payload: Record<string, any> = {
    userId: message.userId,
    timestamp: message.originalTimestamp,
    messageId: message.messageId,
  };

  // Add flattened traits
  if (message.context?.traits) {
    Object.assign(payload, message.context.traits);
  }

  // Add selected context properties
  if (message.context) {
    const contextData: Record<string, any> = {};
    if (message.context.locale) contextData.locale = message.context.locale;
    if (message.context.campaign) contextData.campaign = message.context.campaign;
    if (message.context.userAgent) contextData.userAgent = message.context.userAgent;
    if (Object.keys(contextData).length > 0) {
      payload.context = contextData;
    }
  }

  // Create the response
  const response = defaultRequestConfig();
  response.endpoint = ENDPOINT_CONFIG.IDENTIFY.url;
  response.method = ENDPOINT_CONFIG.IDENTIFY.method;
  response.headers = {
    'Content-Type': ENDPOINT_CONFIG.IDENTIFY.contentType,
    'Authorization': `Bearer ${destinationConfig.destinationKey}`,
  };
  response.body.JSON = payload;

  return response;
};


/**
 * Process group event
 * Associates a user with a group in Survicate
 *
 * Endpoint: POST /endpoint/rudder-stack/group
 *
 * @param message - The RudderStack message
 * @param destinationConfig - The destination configuration
 * @returns Formatted HTTP response
 */
const processGroupEvent = (
  message: SurvicateMessage,
  destinationConfig: SurvicateDestinationConfig,
) => {
  // Skip anonymous calls - we only accept identified users
  if (!message.userId) {
    throw new InstrumentationError(
      'Anonymous group calls are not supported. userId is required.',
    );
  }

  // groupId is required for group events
  if (!message.groupId) {
    throw new InstrumentationError('groupId is required for group events.');
  }

  // Build the payload using the utility function
  const payload: Record<string, any> = {
    userId: message.userId,
    groupId: message.groupId,
    traits: message.traits || {},
    timestamp: message.originalTimestamp,
    messageId: message.messageId,
  };

  // Add flattened traits
  if (message.context?.traits) {
    Object.assign(payload, message.context.traits);
  }

  // Add selected context properties
  if (message.context) {
    const contextData: Record<string, any> = {};
    if (message.context.locale) contextData.locale = message.context.locale;
    if (message.context.campaign) contextData.campaign = message.context.campaign;
    if (message.context.userAgent) contextData.userAgent = message.context.userAgent;
    if (Object.keys(contextData).length > 0) {
      payload.context = contextData;
    }
  }


  // Create the response
  const response = defaultRequestConfig();
  response.endpoint = ENDPOINT_CONFIG.GROUP.url;
  response.method = ENDPOINT_CONFIG.GROUP.method;
  response.headers = {
    'Content-Type': ENDPOINT_CONFIG.GROUP.contentType,
    'Authorization': `Bearer ${destinationConfig.destinationKey}`,
  };
  response.body.JSON = payload;

  return response;
};

/**
 * Process track event
 * Tracks user events in Survicate
 *
 * Endpoint: POST /endpoint/rudder-stack/track
 *
 * @param message - The RudderStack message
 * @param destinationConfig - The destination configuration
 * @returns Formatted HTTP response
 */
const processTrackEvent = (
  message: SurvicateMessage,
  destinationConfig: SurvicateDestinationConfig,
) => {
  // Skip anonymous calls - we only accept identified users
  if (!message.userId) {
    throw new InstrumentationError(
      'Anonymous track calls are not supported. userId is required.',
    );
  }

  // event name is required for track events
  if (!message.event) {
    throw new InstrumentationError('event name is required for track events.');
  }

  // Build the payload using the utility function
  const payload = {
    userId: message.userId,
    event: message.event,
    properties: message.properties || {},
    messageId: message.messageId,
    timestamp: message.originalTimestamp,
  };

  // Create the response
  const response = defaultRequestConfig();
  response.endpoint = ENDPOINT_CONFIG.TRACK.url;
  response.method = ENDPOINT_CONFIG.TRACK.method;
  response.headers = {
    'Content-Type': ENDPOINT_CONFIG.TRACK.contentType,
    'Authorization': `Bearer ${destinationConfig.destinationKey}`,
  };
  response.body.JSON = payload;

  return response;
};

/**
 * Main event processing function
 * Routes events to the appropriate handler based on event type
 *
 * @param event - The router request containing message and destination config
 * @returns Formatted HTTP response
 * @throws ConfigurationError if destination key is missing
 * @throws InstrumentationError if event type is not supported or required fields are missing
 */
const process = (event: SurvicateRouterRequest) => {
  const { message, destination } = event;
  const { destinationKey } = destination.Config;

  // Validate destination configuration
  if (!destinationKey) {
    throw new ConfigurationError('Destination Key is required');
  }

  // Route based on message type
  switch (message.type) {
    case 'identify':
      return processIdentifyEvent(message, destination.Config);
    case 'group':
      return processGroupEvent(message, destination.Config);
    case 'track':
      return processTrackEvent(message, destination.Config);
    default:
      throw new InstrumentationError(
        `Message type "${message.type}" is not supported. Supported types are: identify, group, track`,
      );
  }
};

/**
 * Process router destination
 * Handles batch processing of multiple events
 *
 * @param inputs - Array of router requests for batch processing
 * @param reqMetadata - Metadata for the request
 * @returns Promise resolving to array of processed responses
 */
const processRouterDest = async (
  inputs: SurvicateRouterRequest[],
  reqMetadata: Record<string, unknown>,
) => {
  const respList = await simpleProcessRouterDest(inputs, process, reqMetadata, {});
  return respList;
};

export { process, processRouterDest };
