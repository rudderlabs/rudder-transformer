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
  IdentifyPayload,
  GroupPayload,
  TrackPayload,
} from './types';

import { ENDPOINT_CONFIG, RESERVED_KEYS } from './config';

const ERR_MISSING_MESSAGE_ID = 'messageId is required.';
const ERR_MISSING_TIMESTAMP = 'originalTimestamp is required.';

type EndpointEntry = (typeof ENDPOINT_CONFIG)[keyof typeof ENDPOINT_CONFIG];

function buildResponse(endpoint: EndpointEntry, apiKey: string, payload: Record<string, any>) {
  const response = defaultRequestConfig();
  response.endpoint = endpoint.url;
  response.method = endpoint.method;
  response.headers = {
    'Content-Type': endpoint.contentType,
    Authorization: `Bearer ${apiKey}`,
  };
  response.body.JSON = payload;
  return response;
}

/**
 * Remove reserved identifiers from a traits object.
 */
function filterTraits(traits: Record<string, any> = {}): Record<string, any> {
  const result: Record<string, any> = {};
  for (const [k, v] of Object.entries(traits)) {
    if (!RESERVED_KEYS.includes(k)) {
      result[k] = v;
    }
  }
  return result;
}

/**
 * Extract only the allowed context properties from message.context.
 */
function extractContext(ctx: any): Record<string, any> | undefined {
  if (!ctx) return undefined;
  const out: Record<string, any> = {};
  if (ctx.locale) out.locale = ctx.locale;
  if (ctx.campaign) out.campaign = ctx.campaign;
  if (ctx.userAgent) out.userAgent = ctx.userAgent;
  return Object.keys(out).length > 0 ? out : undefined;
}

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

  if (!msg.messageId) {
    throw new InstrumentationError(ERR_MISSING_MESSAGE_ID);
  }
  if (!msg.originalTimestamp) {
    throw new InstrumentationError(ERR_MISSING_TIMESTAMP);
  }

  // validate message shape
  SurvicateMessageSchema.parse(msg);

  // Skip anonymous calls - we only accept identified users
  if (!msg.userId) {
    throw new InstrumentationError(
      'Anonymous identify calls are not supported. userId is required.',
    );
  }

  // Build the payload - flatten traits and include context properties
  const payload: IdentifyPayload = {
    user_id: msg.userId,
    timestamp: msg.originalTimestamp,
    message_id: msg.messageId,
  };

  // msg.traits applied second so it wins over msg.context.traits on key conflicts
  Object.assign(payload, filterTraits(msg.context?.traits));
  Object.assign(payload, filterTraits(msg.traits));

  // attach filtered context
  const ctxIdentify = extractContext(msg.context);
  if (ctxIdentify) payload.context = ctxIdentify;

  return buildResponse(ENDPOINT_CONFIG.IDENTIFY, destinationConfig.destinationKey, payload);
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

  if (!msg.messageId) {
    throw new InstrumentationError(ERR_MISSING_MESSAGE_ID);
  }
  if (!msg.originalTimestamp) {
    throw new InstrumentationError(ERR_MISSING_TIMESTAMP);
  }

  // validate message shape
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

  const payload: GroupPayload = {
    user_id: msg.userId,
    group_id: msg.groupId,
    timestamp: msg.originalTimestamp,
    message_id: msg.messageId,
  };

  // msg.traits applied second so it wins over msg.context.traits on key conflicts
  Object.assign(payload, filterTraits(msg.context?.traits));
  Object.assign(payload, filterTraits(msg.traits));

  // attach filtered context
  const ctxGroup = extractContext(msg.context);
  if (ctxGroup) payload.context = ctxGroup;


  return buildResponse(ENDPOINT_CONFIG.GROUP, destinationConfig.destinationKey, payload);
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

  if (!msg.messageId) {
    throw new InstrumentationError(ERR_MISSING_MESSAGE_ID);
  }
  if (!msg.originalTimestamp) {
    throw new InstrumentationError(ERR_MISSING_TIMESTAMP);
  }

  // validate message shape
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

  // Build the payload using the utility function
  const payload: TrackPayload = {
    user_id: msg.userId,
    event: msg.event,
    properties: msg.properties || {},
    message_id: msg.messageId,
    timestamp: msg.originalTimestamp,
  };

  // merge non‑reserved traits into properties; msg.traits wins over msg.context.traits on key conflicts
  Object.assign(payload.properties, filterTraits(msg.context?.traits));
  Object.assign(payload.properties, filterTraits(msg.traits));

  // attach filtered context
  const ctxTrack = extractContext(msg.context);
  if (ctxTrack) payload.context = ctxTrack;

  return buildResponse(ENDPOINT_CONFIG.TRACK, destinationConfig.destinationKey, payload);
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
const processEvent = (event: SurvicateRouterRequest) => {
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
  inputs: unknown[],
  reqMetadata: Record<string, unknown>,
) => ( simpleProcessRouterDest(inputs as SurvicateRouterRequest[], processEvent, reqMetadata, {}));

export { processRouterDest };
