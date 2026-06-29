/**
 * Survicate Destination Integration
 * Transforms RudderStack events (identify, group, track) to Survicate API format
 *
 * Supported events:
 * - identify: Send user identification data
 * - group: Associate users with groups
 * - track: Track user events
 */

import { formatZodError, InstrumentationError } from '@rudderstack/integrations-lib';
import { defaultRequestConfig, getSuccessRespEvents, handleRtTfSingleEventError } from '../../util';
import {
  SurvicateRouterRequest,
  SurvicateIdentifyMessage,
  SurvicateGroupMessage,
  SurvicateTrackMessage,
  IdentifyPayload,
  GroupPayload,
  TrackPayload,
  SurvicatePayload,
  EndpointEntry,
  SurvicateRouterRequestSchema,
} from './types';

import { ENDPOINT_CONFIG, RESERVED_KEYS } from './config';
import { RouterTransformationResponse } from '../../../types';

function buildResponse(endpoint: EndpointEntry, destinationKey: string, payload: SurvicatePayload) {
  const response = defaultRequestConfig();
  response.endpoint = endpoint.url;
  response.method = endpoint.method;
  response.headers = {
    'Content-Type': endpoint.contentType,
    Authorization: `Bearer ${destinationKey}`,
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
function extractContext(
  ctx: Record<string, unknown> | undefined,
): Record<string, unknown> | undefined {
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
function validateSurvicateEvent(event: unknown): SurvicateRouterRequest {
  const result = SurvicateRouterRequestSchema.safeParse(event);
  if (!result.success) {
    throw new InstrumentationError(formatZodError(result.error));
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
const processIdentifyEvent = (message: SurvicateIdentifyMessage, destinationKey: string) => {
  // Build the payload - flatten traits and include context properties
  const payload: IdentifyPayload = {
    user_id: message.userId,
    timestamp: message.originalTimestamp,
    message_id: message.messageId,
  };

  // message.traits applied second so it wins over message.context.traits on key conflicts
  Object.assign(payload, filterTraits(message.context?.traits));
  Object.assign(payload, filterTraits(message.traits));

  // attach filtered context
  const ctxIdentify = extractContext(message.context);
  if (ctxIdentify) payload.context = ctxIdentify;

  return buildResponse(ENDPOINT_CONFIG.IDENTIFY, destinationKey, payload);
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
const processGroupEvent = (message: SurvicateGroupMessage, destinationKey: string) => {
  const payload: GroupPayload = {
    user_id: message.userId,
    group_id: message.groupId,
    timestamp: message.originalTimestamp,
    message_id: message.messageId,
  };

  // message.traits applied second so it wins over message.context.traits on key conflicts
  Object.assign(payload, filterTraits(message.context?.traits));
  Object.assign(payload, filterTraits(message.traits));

  // attach filtered context
  const ctxGroup = extractContext(message.context);
  if (ctxGroup) payload.context = ctxGroup;

  return buildResponse(ENDPOINT_CONFIG.GROUP, destinationKey, payload);
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
const processTrackEvent = (message: SurvicateTrackMessage, destinationKey: string) => {
  // Build the payload using the utility function
  const payload: TrackPayload = {
    user_id: message.userId,
    event: message.event,
    properties: message.properties || {},
    message_id: message.messageId,
    timestamp: message.originalTimestamp,
  };

  // merge non‑reserved traits into properties; message.traits wins over message.context.traits on key conflicts
  Object.assign(payload.properties, filterTraits(message.context?.traits));
  Object.assign(payload.properties, filterTraits(message.traits));

  // attach filtered context
  const ctxTrack = extractContext(message.context);
  if (ctxTrack) payload.context = ctxTrack;

  return buildResponse(ENDPOINT_CONFIG.TRACK, destinationKey, payload);
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

  // Route based on message type. Unsupported types are already rejected by the
  // schema's discriminated union, so `message.type` is exhaustively narrowed here.
  switch (message.type) {
    case 'identify':
      return processIdentifyEvent(message, destinationKey);
    case 'group':
      return processGroupEvent(message, destinationKey);
    case 'track':
      return processTrackEvent(message, destinationKey);
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
const processRouterDest = async (events: unknown[]): Promise<RouterTransformationResponse[]> => {
  if (!events || events.length === 0) return [];

  const failedResponses: RouterTransformationResponse[] = [];
  const successfulResponses: RouterTransformationResponse[] = [];

  for (const event of events) {
    try {
      const survicateEvent = validateSurvicateEvent(event);
      const response = processEvent(survicateEvent);
      successfulResponses.push(
        getSuccessRespEvents(
          response,
          [survicateEvent.metadata],
          survicateEvent.destination,
          false,
        ),
      );
    } catch (error) {
      const safeEvent =
        event && typeof event === 'object'
          ? (event as { metadata?: unknown; destination?: unknown })
          : { metadata: undefined, destination: undefined };
      failedResponses.push(handleRtTfSingleEventError(safeEvent, error, {}));
    }
  }

  return [...successfulResponses, ...failedResponses];
};

export { processRouterDest };
