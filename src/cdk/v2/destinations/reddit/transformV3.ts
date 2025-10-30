import {
  getHashFromArrayWithDuplicate,
  InstrumentationError,
  removeUndefinedAndNullValues,
} from '@rudderstack/integrations-lib';
import sha256 from 'sha256';
import {
  RedditResponse,
  RedditRouterRequest,
  RedditConversionEventsPayload,
  RedditEventType,
  RedditEventMetadata,
  RedditUserData,
} from './types';
import userDataMapping from './data/userDataMapping.json';
import { constructPayload, defaultRequestConfig, isAppleFamily } from '../../../../v0/util';
import { RudderMessage } from '../../../../types';
import { ecomEventMaps, V3_ENDPOINT } from './config';
import {
  convertToUpperSnakeCase,
  populateRevenueField,
  generateAndValidateTimestamp,
} from './utils';

const prepareUserObject = (
  message: RudderMessage,
  hashData: boolean,
): RedditUserData | undefined => {
  const userData = constructPayload(message, userDataMapping);
  const os = (message.context as { os?: { name?: string } })?.os?.name?.toLowerCase() || null;
  if (!userData) {
    return undefined;
  }
  if (isAppleFamily(os)) {
    userData.idfa = (
      message.context as { device?: { advertisingId?: string } }
    )?.device?.advertisingId?.trim();
  }
  if (os === 'android') {
    userData.aaid = (
      message.context as { device?: { advertisingId?: string } }
    )?.device?.advertisingId?.trim();
  }
  if (userData && hashData) {
    userData.email = userData?.email ? sha256(userData.email) : null;
    userData.external_id = userData?.external_id ? sha256(userData.external_id) : null;
    userData.ip_address = userData?.ip_address ? sha256(userData.ip_address) : null;
    userData.phone_number = userData?.phone_number ? sha256(userData.phone_number) : null;
    userData.idfa = userData?.idfa ? sha256(userData.idfa) : null;
    userData.aaid = userData?.aaid ? sha256(userData.aaid) : null;
  }

  return removeUndefinedAndNullValues(userData) as RedditUserData;
};

/**
 * Prepares the event type by mapping the incoming event name to the destination's expected event type.
 * @param message - The RudderMessage containing the event name.
 * @param eventsMapping - Array of event mapping objects.
 * @returns The mapped event type as a string, or undefined if not found.
 */
const prepareEventType = (
  message: RudderMessage,
  eventsMapping: Record<string, string>[],
): RedditEventType | RedditEventType[] => {
  const { event } = message;
  if (!event) {
    throw new InstrumentationError('Event name is required in the message');
  }
  const eventsMap = getHashFromArrayWithDuplicate(eventsMapping);
  const eventNames = new Set((eventsMap?.[event.toLowerCase()] as string[]) || []);
  if (eventNames.size === 0) {
    for (const ecomEventMap of ecomEventMaps) {
      if (ecomEventMap.src.includes(event)) {
        return { tracking_type: convertToUpperSnakeCase(ecomEventMap.dest) } as RedditEventType;
      }
    }
  } else {
    const eventTypes: RedditEventType[] = [];
    eventNames.forEach((eventName: string) => {
      eventTypes.push({
        tracking_type: convertToUpperSnakeCase(eventName),
      } as RedditEventType);
    });
    return eventTypes;
  }

  return { tracking_type: 'CUSTOM', custom_event_name: event };
};

const prepareProductsArrayWithItemCount = (message: RudderMessage): RedditEventMetadata => {
  const { properties } = message;
  if ((properties as { products: any[] })?.products?.length > 0) {
    let itemCount = 0;
    const products = (properties as { products: any[] })?.products.map((product) => {
      itemCount += 1;
      return {
        id: product.product_id,
        name: product.name,
        category: product.category,
      };
    });
    return {
      item_count: itemCount,
      products,
    };
  }

  return {
    item_count: 1,
    products: [
      {
        id: (properties as { product_id: string })?.product_id,
        name: (properties as { name: string })?.name,
        category: (properties as { category: string })?.category,
      },
    ],
  };
};

const prepareOtherMetadataFields = (message: RudderMessage, type: string): RedditEventMetadata => {
  const { properties, messageId } = message;
  const value = populateRevenueField(type, properties);
  const conversionId = (properties as { conversionId: string })?.conversionId || messageId;
  let otherFields = {};
  if (['PURCHASE', 'ADD_TO_CART', 'VIEW_CONTENT'].includes(type)) {
    otherFields = {
      conversion_id: conversionId,
      currency: (properties as { currency: string })?.currency,
      item_count: (properties as { itemCount: number })?.itemCount,
      value: value ? value / 100 : null,
    };
  } else {
    otherFields = {
      conversion_id: conversionId,
    };
  }
  return removeUndefinedAndNullValues(otherFields) as Record<string, any>;
};

const prepareMetadata = (message: RudderMessage, type: string): RedditEventMetadata => {
  const productsArray = prepareProductsArrayWithItemCount(message);
  const otherMetadataFields = prepareOtherMetadataFields(message, type);
  return {
    ...productsArray,
    ...otherMetadataFields,
  };
};

/**
 * Processes a track event for Reddit destination.
 * @param event - RedditRouterRequest containing message and destination config.
 */
const processTrackEvent = (event: RedditRouterRequest): RedditConversionEventsPayload[] => {
  const { message, destination } = event;
  const { eventsMapping, hashData } = destination.Config;
  const userObject = prepareUserObject(message, hashData);
  const type = prepareEventType(message, eventsMapping);
  const finalPayload: RedditConversionEventsPayload[] = [];
  const clickId = (message.properties as { clickId: string })?.clickId;
  const timestamp = message.timestamp || message.originalTimestamp;
  const eventAt = generateAndValidateTimestamp(timestamp);
  const actionSource = 'WEBSITE' as const;
  const testId = (message.properties as { test_id: string })?.test_id;
  if (Array.isArray(type)) {
    for (const t of type) {
      const metadata = prepareMetadata(message, t.tracking_type);
      const payload = {
        click_id: clickId,
        event_at: eventAt,
        action_source: actionSource,
        user: userObject,
        type: t,
        metadata,
      };
      if (testId) {
        finalPayload.push({ data: { events: [payload], test_id: testId } });
      } else {
        finalPayload.push({ data: { events: [payload] } });
      }
    }
  } else {
    const metadata = prepareMetadata(message, type.tracking_type);
    const payload = {
      click_id: clickId,
      event_at: eventAt,
      action_source: actionSource,
      user: userObject,
      type,
      metadata,
    };
    if (testId) {
      finalPayload.push({ data: { events: [payload], test_id: testId } });
    } else {
      finalPayload.push({ data: { events: [payload] } });
    }
  }
  return finalPayload;
};

export const process = (event: RedditRouterRequest): RedditResponse[] => {
  const { message, destination, metadata } = event;

  if (!message.type) {
    throw new InstrumentationError('Message type is required');
  }

  if (message.type === 'track') {
    const finalPayload = processTrackEvent(event);
    const finalResponse: RedditResponse[] = [];
    finalPayload.forEach((payload) => {
      const response = defaultRequestConfig() as unknown as RedditResponse;
      response.body.JSON = payload as RedditConversionEventsPayload;
      response.endpoint = `${V3_ENDPOINT}${destination.Config.accountId}/conversion_events`;
      response.headers = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${metadata.secret.accessToken}`,
      };
      finalResponse.push(response);
    });
    return finalResponse;
  }

  throw new InstrumentationError(`Message type ${message.type} is not supported`);
};
