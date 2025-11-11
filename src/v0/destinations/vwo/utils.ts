import { InstrumentationError } from '@rudderstack/integrations-lib';
import { removeUndefinedAndNullValues } from '../../util';
import { RudderMessage } from '../../../types';
import { VWOEventPayload } from './types';

/**
 * Builds the VWO event payload from RudderStack message
 * 
 * @param message - RudderStack message object
 * @param userId - User identifier (userId or anonymousId)
 * @returns Constructed VWO payload
 */
export const buildVWOPayload = (message: RudderMessage, userId: string): VWOEventPayload => {
  const timestamp = Date.now();
  const sessionId = Math.floor(timestamp / 1000);

  // Extract event properties safely
  const eventProperties = message.properties || {};
  
  const payload: VWOEventPayload = {
    d: {
      msgId: `${userId}-${timestamp}`,
      visId: userId,
      event: {
        props: {
          isCustomEvent: true,
          vwoMeta: {
            source: 'rudderstack',
          },
          // Include event-specific properties
          ...eventProperties,
          // Add essential message metadata
          eventType: message.type,
          eventName: message.event,
        },
        name: `rudderstack.${message.type}`,
        time: timestamp,
      },
      sessionId,
    },
  };

  return removeUndefinedAndNullValues(payload) as VWOEventPayload;
};

/**
 * Validates required fields for VWO events
 * 
 * @param message - RudderStack message object
 * @throws InstrumentationError if required fields are missing
 */
export const validateVWOEvent = (message: RudderMessage): void => {
  // Validate event name for track events
  if (message.type === 'track' && !message.event) {
    throw new InstrumentationError('Event name is required for track events');
  }

  // Validate user identifier
  if (!message.userId && !message.anonymousId) {
    throw new InstrumentationError('Either userId or anonymousId is required');
  }
};

/**
 * Gets the user identifier from the message
 * Prefers userId over anonymousId
 * 
 * @param message - RudderStack message object
 * @returns User identifier string
 */
export const getUserIdentifier = (message: RudderMessage): string => {
  if (message.userId) {
    return message.userId;
  }
  if (message.anonymousId) {
    return message.anonymousId;
  }
  throw new Error('Unreachable');
};

/**
 * Constructs the VWO API endpoint with query parameters
 * 
 * @param baseEndpoint - Base VWO API endpoint for the region
 * @param accountId - VWO account ID
 * @param eventName - Name of the event being tracked
 * @returns Complete endpoint URL with query parameters
 */
export const buildEndpoint = (
  baseEndpoint: string,
  accountId: string,
  eventName: string,
): string => {
  return `${baseEndpoint}?en=${encodeURIComponent(eventName)}&a=${encodeURIComponent(accountId)}`;
};

