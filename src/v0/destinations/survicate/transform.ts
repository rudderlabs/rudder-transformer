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
  SurvicateIdentifyMessage,
  SurvicateGroupMessage,
  SurvicateTrackMessage,
  SurvicateMessageSchema,
  IdentifyPayload,
  GroupPayload,
  TrackPayload,
  SurvicatePayload,
  EndpointEntry,
} from './types';

import { ENDPOINT_CONFIG, RESERVED_KEYS } from './config';

function buildResponse(endpoint: EndpointEntry, apiKey: string, payload: SurvicatePayload) {
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
function filterTraits(traits: Record<string, unknown> = {}): Record<string, unknown> {
  const result: Record<string, unknown> = {};
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
function extractContext(ctx: SurvicateMessage['context']): Record<string, unknown> | undefined {
  if (!ctx) return undefined;
  const out: Record<string, unknown> = {};
  if (ctx.locale) out.locale = ctx.locale;
  if (ctx.campaign) out.campaign = ctx.campaign;
  if (ctx.userAgent) out.userAgent = ctx.userAgent;
  return Object.keys(out).length > 0 ? out : undefined;
}

/**
 * Validate (and normalize, via the schema's preprocess) an incoming message
 * once, up front. safeParse keeps schema failures at 400 (InstrumentationError)
 * rather than a raw ZodError (500), and returns a typed, discriminated message
 * so each handler needs no further field checks or casts.
 */
function validateMessage(message: unknown): SurvicateMessage {
  const result = SurvicateMessageSchema.safeParse(message);
  if (!result.success) {
    // The schema attaches a friendly, field-specific message to each issue.
    throw new InstrumentationError(result.error.errors[0].message);
  }
  return result.data;
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
  msg: SurvicateIdentifyMessage,
  destinationConfig: SurvicateDestinationConfig,
) => {
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
  msg: SurvicateGroupMessage,
  destinationConfig: SurvicateDestinationConfig,
) => {
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
  msg: SurvicateTrackMessage,
  destinationConfig: SurvicateDestinationConfig,
) => {
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

  // Normalize + validate once here so each handler receives a validated message.
  const msg = validateMessage(message);

  // Route based on message type. Unsupported types are already rejected by the
  // schema's discriminated union, so `msg.type` is exhaustively narrowed here.
  switch (msg.type) {
    case 'identify':
      return processIdentifyEvent(msg, destination.Config);
    case 'group':
      return processGroupEvent(msg, destination.Config);
    case 'track':
      return processTrackEvent(msg, destination.Config);
    default:
      throw new InstrumentationError('Unsupported Survicate event type.');
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
const processRouterDest = async (inputs: unknown, reqMetadata: Record<string, unknown>) =>
  simpleProcessRouterDest(inputs as SurvicateRouterRequest[], processEvent, reqMetadata, {});

export { processRouterDest };
