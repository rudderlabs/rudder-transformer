import {
  getHashFromArrayWithDuplicate,
  removeUndefinedAndNullValues,
} from '@rudderstack/integrations-lib';
import { RedditRouterRequest } from './types';
import userDataMapping from './data/userDataMapping.json';
import { constructPayload, defaultRequestConfig, isAppleFamily } from '../../../../v0/util';
import { RudderMessage } from '../../../../types';
import { ecomEventMaps, V3_ENDPOINT } from './config';
import { convertToUpperSnakeCase, populateRevenueField } from './utils';

const sha256 = require('sha256');

const prepareUserObject = (message: RudderMessage, hashData: boolean) => {
  const userData = constructPayload(message, userDataMapping);
  const os = (message.context as { os?: { name?: string } })?.os?.name?.toLowerCase() || null;
  if (!userData) {
    return null;
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

  return removeUndefinedAndNullValues(userData);
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
):
  | { tracking_type: string }
  | { tracking_type: string }[]
  | { tracking_type: 'CUSTOM'; custom_event_name: string } => {
  const { event } = message;
  if (!event) {
    throw new Error('Event name is required in the message');
  }
  const eventsMap = getHashFromArrayWithDuplicate(eventsMapping);
  const eventNames = new Set((eventsMap?.[event] as string[]) || []);
  if (eventNames.size === 0) {
    for (const ecomEventMap of ecomEventMaps) {
      if (ecomEventMap.src.includes(event)) {
        return { tracking_type: convertToUpperSnakeCase(ecomEventMap.dest) };
      }
    }
  } else {
    const eventTypes: { tracking_type: string }[] = [];
    eventNames.forEach((eventName: string) => {
      eventTypes.push({
        tracking_type: convertToUpperSnakeCase(eventName),
      });
    });
    return eventTypes;
  }

  return { tracking_type: 'CUSTOM', custom_event_name: event };
};

const prepareProductsArray = (message: RudderMessage) => {
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

const prepareOtherFields = (message: RudderMessage, type: string): Record<string, any> => {
  const { properties, messageId } = message;
  const value = populateRevenueField(type, properties);
  const conversionId = (properties as { conversionId: string })?.conversionId || messageId;
  let otherFields = {};
  if (type in ['PURCHASE', 'ADD_TO_CART', 'VIEW_CONTENT']) {
    otherFields = {
      conversion_id: conversionId,
      currency: (properties as { currency: string })?.currency,
      item_count: (properties as { itemCount: number })?.itemCount,
      value: value ? value / 100 : null,
    };
  }
  otherFields = {
    conversion_id: conversionId,
  };
  return removeUndefinedAndNullValues(otherFields) as Record<string, any>;
};

const prepareMetadata = (message: RudderMessage, type: string) => {
  const productsArray = prepareProductsArray(message);
  const otherFields = prepareOtherFields(message, type);
  return {
    ...productsArray,
    ...otherFields,
  };
};

/**
 * Processes a track event for Reddit destination.
 * @param event - RedditRouterRequest containing message and destination config.
 */
const processTrackEvent = (event: RedditRouterRequest) => {
  const { message, destination } = event;
  const { eventsMapping, hashData } = destination.Config;
  const userObject = prepareUserObject(message, hashData);
  const type = prepareEventType(message, eventsMapping);
  const finalPayload: Record<string, any>[] = [];
  const clickId = (message.properties as { clickId: string })?.clickId;
  const eventAt = (message.properties as { timestamp: string })?.timestamp;
  const actionSource = 'WEBSITE';
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
      finalPayload.push(payload);
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
    finalPayload.push(payload);
  }
  return finalPayload;
};

export const process = (event: RedditRouterRequest) => {
  const { message, destination, metadata } = event;

  if (!message.type) {
    throw new Error('Message type is required');
  }

  if (message.type === 'track') {
    return processTrackEvent(event).map((finalPayload) => {
      const response = defaultRequestConfig();
      response.body.JSON = { data: { events: [finalPayload] } };
      response.endpoint = V3_ENDPOINT + destination.Config.accountId;
      response.headers = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${metadata.secret.accessToken}`,
      };
      return response;
    });
  }

  throw new Error(`Message type ${message.type} is not supported`);
};
