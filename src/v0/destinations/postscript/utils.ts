/**
 * PostScript Destination Utility Functions
 *
 * This file contains utility functions for PostScript destination implementation.
 * Includes functions for payload building, subscriber lookup, batch processing,
 * and API communication helpers.
 */

import { httpGET } from '../../../adapters/network';
import {
  PostscriptSubscriberPayload,
  PostscriptCustomEventPayload,
  PostscriptHeaders,
  PostscriptLookupResponse,
  ProcessedEvent,
  SubscriberLookupResult,
  PostscriptDestination,
  PostscriptConnection,
  PostscriptBatchResponse,
} from './types';
import { SUBSCRIBERS_ENDPOINT, EXTERNAL_ID_TYPES } from './config';
import {
  getFieldValueFromMessage,
  getDestinationExternalID,
  removeUndefinedAndNullValues,
  defaultRequestConfig,
  getSuccessRespEvents,
  constructPayload,
} from '../../util';
import { RudderMessage } from '../../../types';

// Import the subscriber field mapping
const subscriberMapping = require('./data/postscriptSubscriberConfig.json');

/**
 * Builds HTTP headers for PostScript API requests
 *
 * @param apiKey - PostScript API key
 * @returns PostScript API headers object
 */
export const buildHeaders = (apiKey: string): PostscriptHeaders => ({
  'Content-type': 'application/json',
  Accept: 'application/json',
  Authorization: `Bearer ${apiKey}`,
  'X-Postscript-Partner-Key': process.env.POSTSCRIPT_PARTNER_API_KEY,
});

/**
 * Validates required fields for PostScript operations
 *
 * @param message - RudderStack message
 * @param requiredFields - Array of required field names
 * @throws Error if any required field is missing
 */
export const validateRequiredFields = (message: RudderMessage, requiredFields: string[]): void => {
  const missingFields = requiredFields.filter((field) => {
    const value = getFieldValueFromMessage(message, field);
    return !value;
  });

  if (missingFields.length > 0) {
    throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
  }
};

/**
 * Builds PostScript subscriber payload from RudderStack message
 *
 * Maps RudderStack traits to PostScript subscriber fields and extracts
 * custom properties for subscriber profile enhancement.
 *
 * @param message - RudderStack identify message
 * @returns PostScript subscriber payload
 */
export const buildSubscriberPayload = (message: RudderMessage): PostscriptSubscriberPayload => {
  const payload: PostscriptSubscriberPayload = {};
  const contextTraits = (message.context as any)?.traits ?? {};
  const messageTraits = message.traits ?? {};

  // Combine traits from both context and message level, with context taking priority
  const allTraits = { ...messageTraits, ...contextTraits };

  // Check if we have a subscriber ID (meaning this is an update operation)
  const subscriberId =
    getDestinationExternalID(message, EXTERNAL_ID_TYPES.SUBSCRIBER_ID) ??
    contextTraits.subscriberId;
  const isUpdate = !!subscriberId;

  // Use constructPayload to map fields from the JSON configuration
  const basePayload = constructPayload(message, subscriberMapping) as PostscriptSubscriberPayload;

  // Start with the mapped payload
  Object.assign(payload, basePayload);

  // For update operations, remove subscriber_id from payload as it goes in the URL
  if (isUpdate && payload.subscriber_id) {
    delete payload.subscriber_id;
  }

  // Handle external IDs from message context - but don't include subscriber_id in payload if it's used in endpoint
  const externalId = getDestinationExternalID(message, EXTERNAL_ID_TYPES.EXTERNAL_ID);
  const shopifyCustomerId = getDestinationExternalID(
    message,
    EXTERNAL_ID_TYPES.SHOPIFY_CUSTOMER_ID,
  );

  // Include external_id and shopify_customer_id in payload (but not subscriber_id for updates)
  if (externalId) {
    payload.external_id = externalId;
  }
  if (shopifyCustomerId) {
    payload.shopify_customer_id = Number(shopifyCustomerId);
  }

  // Extract custom properties from traits (excluding mapped fields)
  const customProperties: Record<string, any> = {};
  const mappedSourceKeys = new Set<string>();

  // Collect all mapped source keys (handling both string and array sourceKeys)
  subscriberMapping.forEach((mapping: any) => {
    if (Array.isArray(mapping.sourceKeys)) {
      mapping.sourceKeys.forEach((key: string) => {
        // Extract the trait key from paths like "traits.keyword" or "context.traits.keyword"
        const traitKey = key.replace(/^(traits\.|context\.traits\.)/, '');
        mappedSourceKeys.add(traitKey);
      });
    } else if (typeof mapping.sourceKeys === 'string') {
      mappedSourceKeys.add(mapping.sourceKeys);
    }
  });

  Object.entries(allTraits).forEach(([key, value]) => {
    if (!mappedSourceKeys.has(key) && value !== undefined && value !== null) {
      // Convert camelCase to snake_case for custom properties
      const snakeCaseKey = key.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
      customProperties[snakeCaseKey] = value;
    }
  });

  // Add custom properties if any exist
  if (Object.keys(customProperties).length > 0) {
    payload.properties = customProperties;
  }

  return removeUndefinedAndNullValues(payload);
};

/**
 * Builds PostScript custom event payload from RudderStack message
 *
 * Maps RudderStack track event to PostScript custom event format
 * with proper timestamp handling and property extraction.
 *
 * @param message - RudderStack track message
 * @returns PostScript custom event payload
 */
export const buildCustomEventPayload = (message: RudderMessage): PostscriptCustomEventPayload => {
  const payload: PostscriptCustomEventPayload = {
    type: message.event ?? 'Unknown Event',
  };

  // Map subscriber identification fields
  const subscriberId = getDestinationExternalID(message, EXTERNAL_ID_TYPES.SUBSCRIBER_ID);
  const externalId = getDestinationExternalID(message, EXTERNAL_ID_TYPES.EXTERNAL_ID);

  // Get email and phone from context traits (don't fallback to external IDs)
  const contextTraits = (message.context as any)?.traits ?? {};
  const { email, phone } = contextTraits;

  // Add subscriber identification (prefer subscriber_id, then external_id, then userId as fallback)
  if (subscriberId) {
    payload.subscriber_id = subscriberId;
  } else if (externalId) {
    payload.external_id = externalId;
  } else if (message.userId) {
    payload.subscriber_id = message.userId;
  }

  if (email) payload.email = email;
  if (phone) payload.phone = phone;

  // Handle timestamp conversion (prefer originalTimestamp, then timestamp)
  if (message.originalTimestamp) {
    payload.occurred_at = new Date(message.originalTimestamp).toISOString();
  } else if (message.timestamp) {
    payload.occurred_at = new Date(message.timestamp).toISOString();
  }

  // Extract custom properties from event properties
  if (message.properties && typeof message.properties === 'object') {
    const customProperties: Record<string, any> = {};
    Object.entries(message.properties).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        customProperties[key] = value;
      }
    });

    if (Object.keys(customProperties).length > 0) {
      payload.properties = customProperties;
    }
  }

  return removeUndefinedAndNullValues(payload) as PostscriptCustomEventPayload;
};

/**
 * Performs batched subscriber lookup to determine which subscribers already exist.
 * This optimizes API calls by checking multiple subscribers in a single request
 * using PostScript's filter parameters (phone_in, email_in).
 *
 * @param events - Array of processed identify events
 * @param apiKey - PostScript API key
 * @returns Array of lookup results indicating subscriber existence
 */
export const performSubscriberLookup = async (
  events: ProcessedEvent[],
  apiKey: string,
): Promise<SubscriberLookupResult[]> => {
  // Extract phone numbers from events for batch lookup
  const phoneNumbers = events
    .map((event) => event.identifierValue)
    .filter((phone) => phone) as string[];

  if (phoneNumbers.length === 0) {
    return [];
  }

  try {
    // Build lookup request with PostScript's filter parameters
    const headers = buildHeaders(apiKey);
    const params = new URLSearchParams();

    // Use phone_in filter for batch phone lookup
    params.append('phone_in', phoneNumbers.join(','));

    // Add pagination to handle large result sets
    params.append('limit', '100');

    const lookupUrl = `${SUBSCRIBERS_ENDPOINT}?${params.toString()}`;

    // Perform batched API call
    const response = await httpGET(
      lookupUrl,
      {
        headers,
      },
      {
        feature: 'subscriber-batch-lookup',
        destType: 'postscript',
        endpointPath: '/subscribers',
        requestMethod: 'GET',
        module: 'router',
      },
    );

    // Parse response and map to lookup results
    const lookupData = response.response as PostscriptLookupResponse;
    const subscribers = lookupData.data || [];

    // Create lookup results mapping each event to subscriber existence
    return events.map((event) => {
      const phone = event.identifierValue;

      // Find existing subscriber by phone
      const existingSubscriber = subscribers.find((sub) => phone && sub.phone_number === phone);

      return {
        exists: !!existingSubscriber,
        subscriberId: existingSubscriber?.id,
        identifierValue: phone ?? '',
        identifierType: 'phone' as const,
      };
    });
  } catch (error) {
    // Return default results (all non-existent) to allow processing to continue
    // This ensures the transformation doesn't fail even if the lookup API is unavailable
    if (error instanceof Error) {
      error.message = `Subscriber batch lookup failed: ${error.message}`;
    }
    return events.map((event) => ({
      exists: false,
      identifierValue: event.identifierValue ?? '',
      identifierType: 'phone' as const,
    }));
  }
};

/**
 * Creates batched responses for PostScript API requests
 *
 * Groups processed events into batches and creates properly formatted
 * response objects for RudderStack delivery system.
 *
 * @param events - Array of processed events
 * @param destination - PostScript destination configuration
 * @param connection - PostScript connection configuration
 * @returns Array of batched responses for delivery
 */
export const batchResponseBuilder = (
  events: ProcessedEvent[],
  destination: PostscriptDestination,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  connection: PostscriptConnection,
): PostscriptBatchResponse[] => {
  if (events.length === 0) {
    return [];
  }

  const responses: PostscriptBatchResponse[] = [];
  const headers = buildHeaders(destination.Config.apiKey);

  // For PostScript, we create individual responses for each event
  events.forEach((event) => {
    const request = defaultRequestConfig();
    request.endpoint = event.endpoint;
    request.method = event.method;
    request.headers = headers;
    request.body.JSON = event.payload;

    const batchResponse = getSuccessRespEvents(
      request,
      [event.metadata],
      destination,
      false, // not batched - individual responses
    );

    responses.push(batchResponse);
  });

  return responses;
};
