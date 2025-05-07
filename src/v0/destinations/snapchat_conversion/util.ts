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
  SnapchatMessage,
  SnapchatBatchedRequest,
  SnapchatPayloadV2,
  EventConversionTypeValue,
  EventConversionType,
} from './types';

export const channelMapping: Record<string, string> = {
  web: 'WEB',
  mobile: 'MOBILE_APP',
  mobile_app: 'MOBILE_APP',
  offline: 'OFFLINE',
};

export function msUnixTimestamp(timestamp: Date): number {
  const time = new Date(timestamp);
  return time.getTime() * 1000 + time.getMilliseconds();
}

export function getHashedValue(identifier: string): string | null {
  if (identifier) {
    const regexExp = /^[\da-f]{64}$/gi;
    if (!regexExp.test(identifier)) {
      return sha256(identifier);
    }
    return identifier;
  }
  return null;
}

export function getNormalizedPhoneNumber(message: SnapchatMessage): string | null {
  const regexExp = /^[\da-f]{64}$/i;
  const phoneNumber = getFieldValueFromMessage(message, 'phone');

  if (!phoneNumber) return null;
  if (regexExp.test(phoneNumber)) return phoneNumber;

  // Remove leading zeros and non-numeric characters
  return String(phoneNumber).replace(/\D/g, '').replace(/^0+/, '') || null;
}

export function getDataUseValue(message: SnapchatMessage): string | null {
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

export function getItemIds(message: SnapchatMessage): string[] | null {
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

export function getPriceSum(message: SnapchatMessage): string {
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
  return 'null';
}

/**
 * Create Snapchat Batch payload based on the passed events
 * @param events - Array of events
 * @param destination - Destination configuration
 * @returns Batched request
 */
export function generateBatchedPayloadForArray(
  events: { body: { JSON: SnapchatPayloadV2 } }[],
  destination: SnapchatDestination,
): SnapchatBatchedRequest {
  const batchResponseList: SnapchatPayloadV2[] = [];

  // extracting destination
  // from the first event in a batch
  const { apiKey } = destination.Config;

  const { batchedRequest } = defaultBatchRequestConfig();

  // Batch event into dest batch structure
  events.forEach((ev) => {
    batchResponseList.push(ev.body.JSON);
  });

  batchedRequest.body.JSON_ARRAY = {
    batch: JSON.stringify(batchResponseList),
  };

  batchedRequest.endpoint = ENDPOINT.Endpoint_v2;
  batchedRequest.headers = {
    'Content-Type': JSON_MIME_TYPE,
    Authorization: `Bearer ${apiKey}`,
  };

  return batchedRequest as SnapchatBatchedRequest;
}

// Checks if there are any mapping events for the track event and returns them
export const eventMappingHandler = (
  message: SnapchatMessage,
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

export const getEventConversionType = (message: SnapchatMessage): EventConversionTypeValue => {
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

export const getEventTimestamp = (message: SnapchatMessage, requiredDays = 37): string | null => {
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
