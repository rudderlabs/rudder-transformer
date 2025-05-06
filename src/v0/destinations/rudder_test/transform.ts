/**
 * Transformation logic for the rudder_test destination
 * This is a minimal implementation designed for testing platform features
 */

import {
  ProcessorTransformationRequest,
  ProcessorTransformationOutput,
  RouterTransformationResponse,
  RouterTransformationRequestData,
} from '../../../types';

/**
 * Process a single event for processor transformation
 *
 * @param event - The event to process
 * @returns The processed event in the format expected by the platform
 */
function process(event: ProcessorTransformationRequest): ProcessorTransformationOutput {
  const { message } = event;

  // Return a simple payload with the original message type and essential fields
  return {
    version: '1',
    type: 'REST',
    method: 'POST',
    endpoint: 'https://rudder-platform.example.com/api',
    userId: message.userId || message.anonymousId,
    headers: {},
    params: {},
    body: {
      JSON: {
        type: message.type,
        userId: message.userId || message.anonymousId,
      },
      JSON_ARRAY: {},
      XML: {},
      FORM: {},
    },
    files: {},
  };
}

/**
 * Helper function to process individual events (non-batched)
 * Each event is processed separately and returns its own response
 *
 * @param events - The events to process individually
 * @returns Array of router transformation responses, one for each event
 */
function processIndividual(
  events: RouterTransformationRequestData[],
): RouterTransformationResponse[] {
  return events.map((event) => {
    try {
      // Process the individual event
      const processedEvent = process({
        message: event.message,
        metadata: event.metadata,
        destination: event.destination,
      });

      // Return a successful response for this event
      return {
        statusCode: 200,
        metadata: [event.metadata],
        destination: event.destination,
        batched: false,
        batchedRequest: processedEvent,
      };
    } catch (error: any) {
      // Handle errors for individual events
      return {
        statusCode: 400,
        metadata: [event.metadata],
        destination: event.destination,
        batched: false,
        error: error.message || 'Unknown error processing event',
      };
    }
  });
}

/**
 * Helper function to process batched events
 * All events are processed together and returned as a single batched response
 *
 * @param events - The events to process as a batch
 * @returns A single router transformation response containing all events
 */
function processBatch(events: RouterTransformationRequestData[]): RouterTransformationResponse[] {
  if (events.length === 0) {
    return [];
  }

  try {
    // Group all events into a single batch
    const allMetadata = events.map((event) => event.metadata);
    const { destination } = events[0];

    // Create a batched request with all events
    const batchedPayloads = events.map((event) =>
      process({
        message: event.message,
        metadata: event.metadata,
        destination: event.destination,
      }),
    );

    // Return a single response for the batch
    return [
      {
        statusCode: 200,
        metadata: allMetadata,
        destination,
        batched: true,
        batchedRequest: batchedPayloads,
      },
    ];
  } catch (error: any) {
    // If batch processing fails, return a single error for all events
    return [
      {
        statusCode: 400,
        metadata: events.map((event) => event.metadata),
        destination: events[0].destination,
        batched: true,
        error: error.message || 'Unknown error processing batch',
      },
    ];
  }
}

/**
 * Router transformation function for batching events
 * This function handles both batched and non-batched event processing based on configuration
 *
 * @param events - The router transformation request containing multiple events
 * @returns The router transformation response with batched or individual events
 */
async function processRouterDest(
  events: RouterTransformationRequestData[],
): Promise<RouterTransformationResponse[]> {
  // Handle empty events array
  if (events.length === 0) {
    return [];
  }

  // Get config options
  const config = events[0].destination.Config || {};

  // Check if we should batch events based on destination config
  const shouldBatch = config.enableBatching === 'true';

  // Process events based on batching configuration
  if (shouldBatch) {
    // Handle batched case
    return processBatch(events);
  }

  // Handle non-batched case (individual events)
  return processIndividual(events);
}

/**
 * Batch transform function for direct batch processing
 * This is called directly by the platform when batch processing is needed
 * Unlike processRouterDest, this function doesn't check the enableBatching config
 * as batching is implicit when this function is called
 *
 * @param events - The events to process as a batch
 * @returns A single router transformation response containing all events
 */
async function batch(
  events: RouterTransformationRequestData[],
): Promise<RouterTransformationResponse[]> {
  // Simply delegate to the processBatch function since the implementation is the same
  // The key difference is that this function is called directly by the platform
  // and doesn't check the enableBatching config
  return processBatch(events);
}

export { process, processRouterDest, batch };
