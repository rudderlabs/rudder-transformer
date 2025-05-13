import get from 'get-value';
import sha256 from 'sha256';
import { InstrumentationError, ConfigurationError } from '@rudderstack/integrations-lib';
import moment from 'moment/moment';
import logger from '../../../logger';

import {
  isDefinedAndNotNull,
  getFieldValueFromMessage,
  defaultBatchRequestConfig,
  getValidDynamicFormConfig,
} from '../../util';
import { JSON_MIME_TYPE } from '../../util/constant';
import { ENDPOINT } from './config';
import {
  SnapchatDestination,
  SnapchatV2Payload,
  EventConversionTypeValue,
  EventConversionType,
  SnapchatV2BatchedRequest,
} from './types';
import { RudderMessage } from '../../../types';

/**
 * Mapping of channel types to Snapchat conversion types
 * Used to determine the event_conversion_type parameter
 */
export const channelMapping: Record<string, string> = {
  web: 'WEB',
  mobile: 'MOBILE_APP',
  mobile_app: 'MOBILE_APP',
  offline: 'OFFLINE',
};

/**
 * Converts a timestamp to millisecond Unix timestamp format
 * @param timestamp - The timestamp to convert
 * @returns The timestamp in milliseconds since Unix epoch
 */
export function msUnixTimestamp(timestamp: Date): number {
  const time = new Date(timestamp);
  return time.getTime() * 1000 + time.getMilliseconds();
}

/**
 * Hashes a value using SHA-256 if it's not already hashed
 * @param identifier - The value to hash
 * @returns The SHA-256 hash of the value, or the value itself if already hashed
 */
export function getHashedValue(identifier: string): string | undefined {
  if (identifier) {
    const regexExp = /^[\da-f]{64}$/gi;
    if (!regexExp.test(identifier)) {
      return sha256(identifier);
    }
    return identifier;
  }
  return undefined;
}

/**
 * Normalizes and formats a phone number for Snapchat
 * @param message - The message containing the phone number
 * @returns A normalized phone number with non-numeric characters removed and leading zeros trimmed
 */
export function getNormalizedPhoneNumber(message: RudderMessage): string | null {
  const regexExp = /^[\da-f]{64}$/i;
  const phoneNumber = getFieldValueFromMessage(message, 'phone');

  if (!phoneNumber) return null;
  if (regexExp.test(phoneNumber)) return phoneNumber;

  // Remove leading zeros and non-numeric characters
  return String(phoneNumber).replace(/\D/g, '').replace(/^0+/, '') || null;
}

/**
 * Gets the data use value for Snapchat's data_use parameter
 * @param message - The message containing the ATT tracking status
 * @returns The data use value for Snapchat, or null if not applicable
 */
export function getDataUseValue(message: RudderMessage): string | null {
  const att = get(message, 'context.device.attTrackingStatus');
  let limitAdTracking: boolean | string | undefined;
  if (isDefinedAndNotNull(att)) {
    if (att === 3) {
      limitAdTracking = false;
    } else if (att === 2) {
      limitAdTracking = true;
    }
  }
  if (limitAdTracking) {
    limitAdTracking = "['lmu']";
    return limitAdTracking;
  }
  return null;
}

export function getItemIds(message: RudderMessage): string[] | null {
  const itemIds: string[] = [];
  const products = get(message, 'properties.products');
  if (products && Array.isArray(products)) {
    products.forEach((element: Record<string, unknown>, index: number) => {
      const pId = element.product_id;
      if (pId) {
        itemIds.push(String(pId));
      } else {
        logger.debug(`product_id not present for product at index ${index}`);
      }
    });
    return itemIds.length > 0 ? itemIds : [];
  }
  return null;
}

export function getPriceSum(message: RudderMessage): string | null {
  let priceSum = 0;
  const products = get(message, 'properties.products');
  if (products && Array.isArray(products)) {
    products.forEach((element: Record<string, unknown>) => {
      const { price } = element;
      const quantity = element.quantity || 1;
      if (
        price &&
        !Number.isNaN(parseFloat(String(price))) &&
        !Number.isNaN(parseInt(String(quantity), 10))
      ) {
        priceSum += parseFloat(String(price)) * parseInt(String(quantity), 10);
      }
    });
    return String(priceSum);
  }
  return null;
}

/**
 * Create Snapchat Batch payload based on the passed events
 * @param events - Array of events to batch
 * @param destination - Destination configuration
 * @returns Batched request with proper headers and endpoint configuration
 */
export function generateBatchedPayloadForArray(
  events: SnapchatV2BatchedRequest[],
  destination: SnapchatDestination,
): SnapchatV2BatchedRequest {
  const batchResponseList: SnapchatV2Payload[] = [];

  // extracting destination
  // from the first event in a batch
  const { apiKey } = destination.Config;

  const { batchedRequest } = defaultBatchRequestConfig();

  // Batch event into dest batch structure
  events.forEach((ev) => {
    batchResponseList.push(ev.body.JSON as SnapchatV2Payload);
  });

  batchedRequest.body.JSON_ARRAY = {
    batch: JSON.stringify(batchResponseList),
  };

  batchedRequest.endpoint = ENDPOINT.Endpoint_v2;
  batchedRequest.headers = {
    'Content-Type': JSON_MIME_TYPE,
    Authorization: `Bearer ${apiKey}`,
  };

  return batchedRequest as SnapchatV2BatchedRequest;
}

/**
 * Checks if there are any mapping events for the track event and returns them
 * @param message - The message containing the event
 * @param destination - The destination configuration with event mappings
 * @returns Array of mapped event names based on configuration
 * @throws InstrumentationError if event name is missing
 */
export const eventMappingHandler = (
  message: RudderMessage,
  destination: SnapchatDestination,
): string[] => {
  let event = get(message, 'event');

  if (!event) {
    throw new InstrumentationError('Event name is required');
  }
  event = event.toString().trim().replace(/\s+/g, '_');

  const { rudderEventsToSnapEvents } = destination.Config;
  const mappedEvents = new Set<string>();

  if (Array.isArray(rudderEventsToSnapEvents)) {
    const validMappings = getValidDynamicFormConfig(
      rudderEventsToSnapEvents,
      'from',
      'to',
      'snapchat_conversion',
      destination.ID,
    );
    validMappings.forEach((mapping: { from: string; to: string }) => {
      if (mapping.from.trim().replace(/\s+/g, '_').toLowerCase() === event.toLowerCase()) {
        mappedEvents.add(mapping.to);
      }
    });
  }

  return [...mappedEvents];
};

/**
 * Determines the event conversion type based on message properties
 * @param message - The message to analyze
 * @returns The appropriate Snapchat event conversion type (WEB, MOBILE_APP, OFFLINE)
 */
export const getEventConversionType = (message: RudderMessage): EventConversionTypeValue => {
  const channel = get(message, 'channel');
  const eventConversionTypeFromProps = get(message, 'properties.eventConversionType');

  if (
    typeof eventConversionTypeFromProps === 'string' &&
    channelMapping[eventConversionTypeFromProps.toLowerCase()]
  ) {
    return channelMapping[eventConversionTypeFromProps.toLowerCase()] as EventConversionTypeValue;
  }
  if (typeof channel === 'string' && channelMapping[channel.toLowerCase()]) {
    return channelMapping[channel.toLowerCase()] as EventConversionTypeValue;
  }
  return EventConversionType.OFFLINE;
};

/**
 * Validates that the required configuration is present for the event conversion type
 * @param eventConversionType - The type of event conversion
 * @param pixelId - The pixel ID for web events
 * @param snapAppId - The Snap app ID for mobile events
 * @param appId - The app ID for mobile events
 * @throws ConfigurationError if required configuration is missing
 */
export const validateEventConfiguration = (
  eventConversionType: EventConversionTypeValue,
  pixelId?: string,
  snapAppId?: string,
  appId?: string,
): void => {
  if (
    (eventConversionType === EventConversionType.WEB ||
      eventConversionType === EventConversionType.OFFLINE) &&
    !pixelId
  ) {
    throw new ConfigurationError('Pixel Id is required for web and offline events');
  }

  if (eventConversionType === EventConversionType.MOBILE_APP && !(appId && snapAppId)) {
    let requiredId = 'App Id';
    if (!snapAppId) {
      requiredId = 'Snap App Id';
    }
    throw new ConfigurationError(`${requiredId} is required for app events`);
  }
};

/**
 * Gets the event timestamp in the format required by Snapchat
 * @param message - The message containing the timestamp
 * @param requiredDays - Maximum number of days in the past allowed for events (default: 37)
 * @returns The formatted timestamp for Snapchat, or null if not available
 * @throws InstrumentationError if event is older than the allowed time window
 */
export const getEventTimestamp = (message: RudderMessage, requiredDays = 37): string | null => {
  const eventTime = getFieldValueFromMessage(message, 'timestamp');
  if (eventTime) {
    const start = moment.unix(parseInt(moment(eventTime).format('X'), 10));
    const current = moment.unix(parseInt(moment().format('X'), 10));
    // calculates past event in days
    const deltaDay = Math.ceil(moment.duration(current.diff(start)).asDays());
    if (deltaDay > requiredDays) {
      throw new InstrumentationError(
        `Events must be sent within ${requiredDays} days of their occurrence`,
      );
    }
    return msUnixTimestamp(new Date(eventTime))?.toString()?.slice(0, 10);
  }
  return eventTime;
};
