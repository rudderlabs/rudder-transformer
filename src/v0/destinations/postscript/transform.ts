/**
 * PostScript Destination Transform Implementation
 *
 * This file implements the transformation logic for PostScript SMS marketing platform.
 * PostScript allows businesses to send SMS messages to customers for marketing and engagement.
 *
 * Supported operations:
 * - Identify: Create or update subscribers with lookup-based approach
 * - Track: Create custom events for subscribers
 *
 * Features:
 * - Subscriber lookup for identifying create vs update operations
 * - Error handling with proper RudderStack status codes
 * - Router transform pattern for efficient bulk processing
 */

import {
  InstrumentationError,
  ConfigurationError,
  mapInBatches,
} from '@rudderstack/integrations-lib';
import { EventType } from '../../../constants';
import { PostscriptRouterRequest, ProcessedEvent, SubscriberLookupResult } from './types';
import { SUBSCRIBERS_ENDPOINT, CUSTOM_EVENTS_ENDPOINT, EXTERNAL_ID_TYPES } from './config';
import {
  handleRtTfSingleEventError,
  getFieldValueFromMessage,
  getDestinationExternalID,
  getEventType,
} from '../../util';
import {
  performSubscriberLookup,
  buildSubscriberPayload,
  buildCustomEventPayload,
  batchResponseBuilder,
} from './utils';

/**
 * Processes a single identify event for PostScript subscriber management
 *
 * Flow:
 * 1. Validates required fields (phone and keyword/keywordId)
 * 2. Maps RudderStack traits to PostScript subscriber fields
 * 3. Extracts custom properties for subscriber profile
 * 4. Returns processed event for batching and lookup operations
 *
 * @param event - RudderStack router input event
 * @returns ProcessedEvent for batch processing
 */
const processIdentifyEvent = (event: PostscriptRouterRequest): ProcessedEvent => {
  const { message, metadata } = event;
  const traits = getFieldValueFromMessage(message, 'traits') || {};

  // Extract and validate required fields for subscriber creation/update
  const { keyword, keywordId } = traits;
  const phone = traits.phone ?? getFieldValueFromMessage(message, 'phone');

  // Check for subscriber ID from external identifiers for update operations
  const subscriberId =
    getDestinationExternalID(message, EXTERNAL_ID_TYPES.SUBSCRIBER_ID) ?? traits.subscriberId;

  // Determine if this is an update operation (subscriber ID is present)
  const isUpdateOperation = !!subscriberId;

  // Phone number is required for create operations, but optional for updates when subscriber ID is present
  if (!phone && !isUpdateOperation) {
    throw new InstrumentationError('Phone is required for subscriber creation');
  }

  // Either keyword or keywordId is required for new subscriber creation (but not for updates)
  if (!isUpdateOperation && !keyword && !keywordId) {
    throw new InstrumentationError(
      'Either keyword or keyword_id is required for subscriber creation',
    );
  }

  // Build the subscriber payload using our mapping configuration
  const payload = buildSubscriberPayload(message);

  // Set endpoint based on operation type
  const endpoint =
    isUpdateOperation && subscriberId
      ? `${SUBSCRIBERS_ENDPOINT}/${subscriberId}`
      : SUBSCRIBERS_ENDPOINT;

  return {
    eventType: 'identify',
    payload,
    metadata,
    endpoint,
    method: isUpdateOperation ? 'PATCH' : 'POST',
    subscriberLookupNeeded: !isUpdateOperation, // Need lookup only for potential create operations
    identifierValue: phone ?? subscriberId, // Use phone for lookups, subscriberId for updates without phone
    identifierType: phone ? 'phone' : 'subscriber_id',
  };
};

/**
 * Processes a single track event for PostScript custom events
 *
 * Flow:
 * 1. Validates event name and subscriber identification
 * 2. Maps RudderStack properties to PostScript event fields
 * 3. Handles timestamp conversion and custom properties
 * 4. Returns processed event ready for API submission
 *
 * @param event - RudderStack router input event
 * @returns ProcessedEvent for batch processing
 */
const processTrackEvent = (event: PostscriptRouterRequest): ProcessedEvent => {
  const { message, metadata } = event;

  // Event name is required for track events
  if (typeof message?.event !== 'string' || !message.event.trim()) {
    throw new InstrumentationError('Event name is required for track events');
  }

  // Build the custom event payload using our mapping configuration
  const payload = buildCustomEventPayload(message);

  // Custom events always use POST method to create new events
  return {
    eventType: 'track',
    payload,
    metadata,
    endpoint: CUSTOM_EVENTS_ENDPOINT,
    method: 'POST',
    subscriberLookupNeeded: false, // Track events don't need subscriber lookup
  };
};

/**
 * Main router transformation function for PostScript destination
 *
 * This function implements the batch processing pattern for PostScript events:
 * 1. Groups and validates incoming events
 * 2. Performs subscriber lookups for identify events to determine create vs update
 * 3. Batches events efficiently for API submission
 * 4. Returns properly formatted responses for RudderStack delivery
 *
 * Features:
 * - Concurrent processing of events for performance
 * - Lookup-based approach for subscriber management
 * - Error handling with proper categorization
 *
 * @param inputs - Array of PostScript router transformation requests
 * @param reqMetadata - Request metadata for error handling
 * @returns Array of batch responses for RudderStack delivery
 */
const processRouterDest = async (
  inputs: PostscriptRouterRequest[],
  reqMetadata: any,
): Promise<any[]> => {
  // Handle empty input gracefully
  if (!inputs?.length) {
    return [];
  }

  // Extract destination configuration from first event
  const { destination: postscriptDestination } = inputs[0];

  // Validate destination configuration
  if (!postscriptDestination.Config?.apiKey) {
    throw new ConfigurationError('PostScript API key is required but not provided');
  }

  // Process events and separate successful transformations from errors
  const processedEventResults = await mapInBatches(inputs, (event) => {
    try {
      let processedEvent: ProcessedEvent;

      const messageType = getEventType(event.message);

      switch (messageType) {
        case EventType.IDENTIFY:
          processedEvent = processIdentifyEvent(event);
          break;

        case EventType.TRACK:
          processedEvent = processTrackEvent(event);
          break;

        default:
          throw new InstrumentationError(
            `Event type "${messageType}" is not supported. Only identify and track events are supported.`,
          );
      }

      return { success: true, data: processedEvent };
    } catch (error) {
      // Handle individual event transformation errors
      const errorResponse = handleRtTfSingleEventError(event, error as Error, reqMetadata);
      return { success: false, error: errorResponse };
    }
  });

  // Separate successful and failed events
  const processedEvents: ProcessedEvent[] = [];
  const errorEvents: any[] = [];

  processedEventResults.forEach((result) => {
    if (result.success && result.data) {
      processedEvents.push(result.data);
    } else if (!result.success && result.error) {
      errorEvents.push(result.error);
    }
  });

  // If no events were successfully processed, return only errors
  if (processedEvents.length === 0) {
    return errorEvents;
  }

  // Separate events that need subscriber lookup from those that don't
  const identifyEvents = processedEvents.filter(
    (event) => event.eventType === 'identify' && event.subscriberLookupNeeded,
  );

  // Perform subscriber lookup for identify events to determine create vs update operations
  let lookupResults: SubscriberLookupResult[] = [];
  if (identifyEvents.length > 0) {
    lookupResults = await performSubscriberLookup(
      identifyEvents,
      postscriptDestination.Config.apiKey,
    );
  }

  // Update identify events based on lookup results
  const updatedIdentifyEvents = identifyEvents.map((event, index) => {
    const lookupResult = lookupResults[index];
    if (lookupResult?.exists) {
      return {
        ...event,
        method: 'PATCH' as const,
        endpoint: `${SUBSCRIBERS_ENDPOINT}/${lookupResult.subscriberId}`,
      };
    }
    return {
      ...event,
      method: 'POST' as const,
      endpoint: SUBSCRIBERS_ENDPOINT,
    };
  });

  // Create a map for quick lookup of updated events by original event reference
  const updatedEventMap = new Map();
  identifyEvents.forEach((originalEvent, index) => {
    updatedEventMap.set(originalEvent, updatedIdentifyEvents[index]);
  });

  // Preserve original event order by mapping each processed event to its updated version
  const allProcessedEvents = processedEvents.map((event) => updatedEventMap.get(event) || event);

  // Create batched responses using the utility function
  const batchedResponses = batchResponseBuilder(allProcessedEvents, postscriptDestination);

  // Combine successful batched responses with individual event errors
  return [...batchedResponses, ...errorEvents];
};

export { processRouterDest };
