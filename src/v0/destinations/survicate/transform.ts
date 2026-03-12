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
  SurvicateMessageSchema,
} from './types';

import { ENDPOINT_CONFIG } from './config';

// repeated error messages
const ERR_MESSAGE_ID_REQUIRED = 'messageId is required.';
const ERR_ORIG_TS_REQUIRED = 'originalTimestamp is required.';

/**
 * Normalize incoming message keys to canonical camelCase.  Rudder sometimes
 * delivers snake_case (e.g. `user_id`) but our handler logic and Zod schema
 * expect camelCase.  Call this at the very start of each processor.
 */
function normalizeMessage(raw: any): SurvicateMessage {
  const msg: any = { ...raw };

  if (raw.user_id && !raw.userId) {
    msg.userId = raw.user_id;
  }
  if (raw.group_id && !raw.groupId) {
    msg.groupId = raw.group_id;
  }
  if (raw.message_id && !raw.messageId) {
    msg.messageId = raw.message_id;
  }
  if (raw.original_timestamp && !raw.originalTimestamp) {
    msg.originalTimestamp = raw.original_timestamp;
  }
  return msg;
}

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
  // allow snake_case input by normalizing first
  const msg = normalizeMessage(message);

  // validate message shape
  SurvicateMessageSchema.parse(msg);

  // Skip anonymous calls - we only accept identified users
  if (!msg.userId) {
    throw new InstrumentationError(
      'Anonymous identify calls are not supported. userId is required.',
    );
  }

  // require audit fields
  if (!msg.messageId) {
    throw new InstrumentationError(ERR_MESSAGE_ID_REQUIRED);
  }
  if (!msg.originalTimestamp) {
    throw new InstrumentationError(ERR_ORIG_TS_REQUIRED);
  }

  // Build the payload - flatten traits and include context properties
  const payload: Record<string, any> = {
    user_id: msg.userId,
    timestamp: msg.originalTimestamp,
    message_id: msg.messageId,
  };

  // Add flattened traits (excluding reserved identifiers to avoid overwriting)
  if (msg.context?.traits) {
    const reserved = ['user_id', 'group_id', 'timestamp', 'message_id'];

    const filtered: Record<string, any> = {};

    for (const [k, v] of Object.entries(msg.context.traits)) {
      if (!reserved.includes(k)) {
        filtered[k] = v;
      }
    }
    Object.assign(payload, filtered);
  }

  // Add selected context properties
  if (msg.context) {
    const contextData: Record<string, any> = {};
    if (msg.context.locale) contextData.locale = msg.context.locale;
    if (msg.context.campaign) contextData.campaign = msg.context.campaign;
    if (msg.context.userAgent) contextData.userAgent = msg.context.userAgent;
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
  const msg = normalizeMessage(message);
  // validate message
  SurvicateMessageSchema.parse(msg);

  // Skip anonymous calls - we only accept identified users
  if (!msg.userId) {
    throw new InstrumentationError(
      'Anonymous group calls are not supported. userId is required.',
    );
  }

  // groupId is required for group events
  if (!msg.groupId) {
    throw new InstrumentationError('groupId is required for group events.');
  }

  // require audit fields
  if (!msg.messageId) {
    throw new InstrumentationError(ERR_MESSAGE_ID_REQUIRED);
  }
  if (!msg.originalTimestamp) {
    throw new InstrumentationError(ERR_ORIG_TS_REQUIRED);
  }

  // Build the payload using the utility function
  const payload: Record<string, any> = {
    user_id: msg.userId,
    group_id: msg.groupId,
    traits: msg.traits || {},
    timestamp: msg.originalTimestamp,
    message_id: msg.messageId,
  };

  // Add flattened traits (excluding reserved identifiers to avoid overwriting)
  if (msg.context?.traits) {
    const reserved = ['user_id', 'group_id', 'timestamp', 'message_id'];
    const filtered: Record<string, any> = {};
    for (const [k, v] of Object.entries(msg.context.traits)) {
      if (!reserved.includes(k)) {
        filtered[k] = v;
      }
    }
    Object.assign(payload, filtered);
  }

  // Add selected context properties
  if (msg.context) {
    const contextData: Record<string, any> = {};
    if (msg.context.locale) contextData.locale = msg.context.locale;
    if (msg.context.campaign) contextData.campaign = msg.context.campaign;
    if (msg.context.userAgent) contextData.userAgent = msg.context.userAgent;
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
  const msg = normalizeMessage(message);
  // validate message
  SurvicateMessageSchema.parse(msg);

  // Skip anonymous calls - we only accept identified users
  if (!msg.userId) {
    throw new InstrumentationError(
      'Anonymous track calls are not supported. userId is required.',
    );
  }

  // event name is required for track events
  if (!msg.event) {
    throw new InstrumentationError('event name is required for track events.');
  }

  // require audit fields
  if (!msg.messageId) {
    throw new InstrumentationError(ERR_MESSAGE_ID_REQUIRED);
  }
  if (!msg.originalTimestamp) {
    throw new InstrumentationError(ERR_ORIG_TS_REQUIRED);
  }

  // Build the payload using the utility function
  const payload: Record<string, any> = {
    user_id: msg.userId,
    event: msg.event,
    properties: msg.properties || {},
    message_id: msg.messageId,
    timestamp: msg.originalTimestamp,
  };

  // Enrich with context traits and properties (exclude reserved keys)
  if (msg.context) {
    const reserved = ['user_id', 'group_id', 'timestamp', 'message_id'];

    // flatten traits into properties
    if (msg.context?.traits) {
      const filteredTraits: Record<string, any> = {};
      for (const [k, v] of Object.entries(msg.context.traits)) {
        if (!reserved.includes(k)) {
          filteredTraits[k] = v;
        }
      }
      if (Object.keys(filteredTraits).length > 0) {
        payload.properties = { ...payload.properties, ...filteredTraits };
      }
    }

    // attach locale/campaign/userAgent to a context block
    const contextData: Record<string, any> = {};
    if (msg.context?.locale) contextData.locale = msg.context.locale;
    if (msg.context?.campaign) contextData.campaign = msg.context.campaign;
    if (msg.context?.userAgent) contextData.userAgent = msg.context.userAgent;
    if (Object.keys(contextData).length > 0) {
      payload.context = contextData;
    }
  }

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
