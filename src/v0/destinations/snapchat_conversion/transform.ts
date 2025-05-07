import get from 'get-value';
import { InstrumentationError } from '@rudderstack/integrations-lib';
import { EventType } from '../../../constants';

import {
  defaultPostRequestConfig,
  constructPayload,
  defaultRequestConfig,
  removeUndefinedAndNullValues,
  getFieldValueFromMessage,
  getSuccessRespEvents,
  isAppleFamily,
  handleRtTfSingleEventError,
  batchMultiplexedEvents,
} from '../../util';
import {
  ENDPOINT,
  eventNameMapping,
  mappingConfig,
  ConfigCategory,
  MAX_BATCH_SIZE,
  pageTypeToTrackEvent,
  API_VERSION,
} from './config';
import {
  getHashedValue,
  getItemIds,
  getPriceSum,
  getDataUseValue,
  getNormalizedPhoneNumber,
  generateBatchedPayloadForArray,
  eventMappingHandler,
  getEventConversionType,
  validateEventConfiguration,
  getEventTimestamp,
} from './util';
import { JSON_MIME_TYPE } from '../../util/constant';
import { processV3, processRouterDest as processRouterV3 } from './transformV3';
import { SnapchatDestination, SnapchatPayloadV2, SnapchatRouterRequest } from './types';

function buildResponse(apiKey: string, payload: SnapchatPayloadV2): any {
  const response = defaultRequestConfig();
  response.endpoint = ENDPOINT.Endpoint_v2;
  response.headers = {
    Authorization: `Bearer ${apiKey}`,
    'Content-Type': JSON_MIME_TYPE,
  };
  response.method = defaultPostRequestConfig.requestMethod;
  response.body.JSON = removeUndefinedAndNullValues(payload);
  return response;
}

const populateHashedTraitsValues = (payload: any, message: Record<string, any>): any => {
  const firstName = getFieldValueFromMessage(message, 'firstName');
  const lastName = getFieldValueFromMessage(message, 'lastName');
  const middleName = getFieldValueFromMessage(message, 'middleName');
  const city = getFieldValueFromMessage(message, 'city');
  const state = getFieldValueFromMessage(message, 'state');
  const zip = getFieldValueFromMessage(message, 'zipcode');
  const updatedPayload = {
    ...payload,
    hashed_first_name_sha: firstName
      ? getHashedValue(firstName.toString().toLowerCase().trim())
      : undefined,
    hashed_middle_name_sha: middleName
      ? getHashedValue(middleName.toString().toLowerCase().trim())
      : undefined,
    hashed_last_name_sha: lastName
      ? getHashedValue(lastName.toString().toLowerCase().trim())
      : undefined,
    hashed_city_sha: city ? getHashedValue(city.toString().toLowerCase().trim()) : undefined,
    hashed_zip: zip ? getHashedValue(zip.toString().toLowerCase().trim()) : undefined,
    hashed_state_sha: state ? getHashedValue(state.toString().toLowerCase().trim()) : undefined,
  };
  return updatedPayload;
};

/**
 * Seperate out hashing operations into one function
 * @param payload - The payload to populate with hashed values
 * @param message - The message containing the values to hash
 * @returns updatedPayload - The payload with hashed values
 */
const populateHashedValues = (payload: any, message: Record<string, any>): any => {
  const email = getFieldValueFromMessage(message, 'email');
  const phone = getNormalizedPhoneNumber(message);
  const ip = message.context?.ip || message.request_ip;

  const updatedPayload = populateHashedTraitsValues(payload, message);
  if (email) {
    updatedPayload.hashed_email = getHashedValue(email.toString().toLowerCase().trim());
  }
  if (phone) {
    updatedPayload.hashed_phone_number = getHashedValue(phone.toString().toLowerCase().trim());
  }
  if (ip) {
    updatedPayload.hashed_ip_address = getHashedValue(ip.toString().toLowerCase().trim());
  }
  // only in case of ios platform this is required
  if (
    isAppleFamily(message.context?.device?.type) &&
    (message.properties?.idfv || message.context?.device?.id)
  ) {
    updatedPayload.hashed_idfv = getHashedValue(
      message.properties?.idfv || message.context?.device?.id,
    );
  }

  if (message.properties?.adId || message.context?.device?.advertisingId) {
    updatedPayload.hashed_mobile_ad_id = getHashedValue(
      message.properties?.adId || message.context?.device?.advertisingId,
    );
  }
  return updatedPayload;
};

const getEventCommonProperties = (message: Record<string, any>): any =>
  constructPayload(message, mappingConfig[ConfigCategory.TRACK_COMMON.name]);

const validateRequiredFields = (payload: any): void => {
  if (
    !payload.hashed_email &&
    !payload.hashed_phone_number &&
    !payload.hashed_mobile_ad_id &&
    !(payload.hashed_ip_address && payload.user_agent)
  ) {
    throw new InstrumentationError(
      'At least one of email or phone or advertisingId or ip and userAgent is required',
    );
  }
};

const addSpecificEventDetails = (
  message: Record<string, any>,
  payload: any,
  eventConversionType: string,
  pixelId?: string,
  snapAppId?: string,
  appId?: string,
): any => {
  const updatedPayload = { ...payload };
  if (eventConversionType === 'WEB') {
    updatedPayload.pixel_id = pixelId;
    updatedPayload.page_url = getFieldValueFromMessage(message, 'pageUrl');
  }

  if (eventConversionType === 'MOBILE_APP') {
    updatedPayload.snap_app_id = snapAppId;
    updatedPayload.app_id = appId;
  }

  if (eventConversionType === 'OFFLINE') {
    updatedPayload.pixel_id = pixelId;
  }
  return updatedPayload;
};

// Returns the response for the track event after constructing the payload and setting necessary fields
const trackResponseBuilder = (message: Record<string, any>, destination: SnapchatDestination, mappedEvent: string): any => {
  let payload: any = {};
  const event = mappedEvent?.toString().trim().replace(/\s+/g, '_');
  const eventConversionType = getEventConversionType(message);
  const { apiKey, pixelId, snapAppId, appId, deduplicationKey, enableDeduplication } = destination.Config;
  validateEventConfiguration(eventConversionType, pixelId, snapAppId, appId);

  if (eventNameMapping[event.toLowerCase()]) {
    // Snapchat standard events
    // get event specific parameters
    switch (event.toLowerCase()) {
      /* Browsing Section */
      case 'products_searched':
        payload = constructPayload(message, mappingConfig[ConfigCategory.PRODUCTS_SEARCHED.name]);
        payload.event_type = eventNameMapping[event.toLowerCase()];
        break;
      case 'product_list_viewed':
        payload = constructPayload(message, mappingConfig[ConfigCategory.PRODUCT_LIST_VIEWED.name]);
        payload.event_type = eventNameMapping[event.toLowerCase()];
        payload.item_ids = getItemIds(message);
        payload.price = payload.price || getPriceSum(message);
        break;
      /* Promotions Section */
      case 'promotion_viewed':
        payload = constructPayload(message, mappingConfig[ConfigCategory.PROMOTION_VIEWED.name]);
        payload.event_type = eventNameMapping[event.toLowerCase()];
        break;
      case 'promotion_clicked':
        payload = constructPayload(message, mappingConfig[ConfigCategory.PROMOTION_CLICKED.name]);
        payload.event_type = eventNameMapping[event.toLowerCase()];
        break;
      /* Ordering Section */
      case 'product_viewed':
        payload = constructPayload(message, mappingConfig[ConfigCategory.PRODUCT_VIEWED.name]);
        payload.event_type = eventNameMapping[event.toLowerCase()];
        break;
      case 'checkout_started':
        payload = constructPayload(message, mappingConfig[ConfigCategory.CHECKOUT_STARTED.name]);
        payload.event_type = eventNameMapping[event.toLowerCase()];
        payload.item_ids = getItemIds(message);
        payload.price = payload.price || getPriceSum(message);
        break;
      case 'payment_info_entered':
        payload = constructPayload(
          message,
          mappingConfig[ConfigCategory.PAYMENT_INFO_ENTERED.name],
        );
        payload.event_type = eventNameMapping[event.toLowerCase()];
        break;
      case 'order_completed':
        payload = constructPayload(message, mappingConfig[ConfigCategory.ORDER_COMPLETED.name]);
        payload.event_type = eventNameMapping[event.toLowerCase()];
        payload.item_ids = getItemIds(message);
        payload.price = payload.price || getPriceSum(message);
        break;
      case 'product_added':
        payload = constructPayload(message, mappingConfig[ConfigCategory.PRODUCT_ADDED.name]);
        payload.event_type = eventNameMapping[event.toLowerCase()];
        break;
      /* Wishlist Section */
      case 'product_added_to_wishlist':
        payload = constructPayload(
          message,
          mappingConfig[ConfigCategory.PRODUCT_ADDED_TO_WISHLIST.name],
        );
        payload.event_type = eventNameMapping[event.toLowerCase()];
        break;
      /* Snapchat General Events */
      case 'sign_up':
        payload = constructPayload(message, mappingConfig[ConfigCategory.SIGN_UP.name]);
        payload.event_type = eventNameMapping[event.toLowerCase()];
        break;
      default:
        payload = constructPayload(message, mappingConfig[ConfigCategory.DEFAULT.name]);
        payload.event_type = eventNameMapping[event.toLowerCase()];
        break;
    }
  } else {
    throw new InstrumentationError(`Event ${event} doesn't match with Snapchat Events!`);
  }

  payload = { ...payload, ...getEventCommonProperties(message) };
  payload = populateHashedValues(payload, message);
  validateRequiredFields(payload);
  payload.timestamp = getEventTimestamp(message);
  payload.data_use = getDataUseValue(message);

  payload.event_conversion_type = eventConversionType;
  payload = addSpecificEventDetails(
    message,
    payload,
    eventConversionType,
    pixelId,
    snapAppId,
    appId,
  );
  // adding for deduplication for more than one source
  if (enableDeduplication) {
    const dedupId = deduplicationKey || 'messageId';
    payload.client_dedup_id = get(message, dedupId);
  }
  payload = removeUndefinedAndNullValues(payload);

  // build response
  const response = buildResponse(apiKey, payload);
  return response;
};

export const process = (event: any): any => {
  const { message, destination } = event;
  if (destination.Config?.apiVersion === API_VERSION.v3) {
    return processV3(event);
  }
  if (!message.type) {
    throw new InstrumentationError('Event type is required');
  }

  const messageType = message.type.toLowerCase();
  let response;
  if (messageType === EventType.PAGE) {
    response = [trackResponseBuilder(message, destination, pageTypeToTrackEvent)];
  } else if (messageType === EventType.TRACK) {
    const mappedEvents = eventMappingHandler(message, destination);
    if (mappedEvents.length > 0) {
      response = [];
      mappedEvents.forEach((mappedEvent) => {
        const res = trackResponseBuilder(message, destination, mappedEvent);
        response.push(res);
      });
    } else {
      response = trackResponseBuilder(message, destination, get(message, 'event'));
    }
  } else {
    throw new InstrumentationError(`Event type ${messageType} is not supported`);
  }
  return response;
};

export const processRouterDest = async (inputs: SnapchatRouterRequest[], reqMetadata: any): Promise<any[]> => {
  const { destination } = inputs[0];
  if (destination.Config?.apiVersion === API_VERSION.v3) {
    return processRouterV3(inputs, reqMetadata);
  }
  const eventsChunk: any[] = []; // temporary variable to divide payload into chunks
  const errorRespList: any[] = [];
  inputs.forEach((event) => {
    try {
      let resp = event.message;
      if (!event.message.statusCode) {
        // already transformed event
        resp = process(event);
      }
      eventsChunk.push({
        message: Array.isArray(resp) ? resp : [resp],
        metadata: event.metadata,
        destination: event.destination,
      });
    } catch (error) {
      const errRespEvent = handleRtTfSingleEventError(event, error, reqMetadata);
      errorRespList.push(errRespEvent);
    }
  });

  const batchResponseList: any[] = [];
  if (eventsChunk.length > 0) {
    const batchedEvents = batchMultiplexedEvents(eventsChunk, MAX_BATCH_SIZE);
    batchedEvents.forEach((batch) => {
      const batchedRequest = generateBatchedPayloadForArray(batch.events, batch.destination);
      batchResponseList.push(
        getSuccessRespEvents(batchedRequest, batch.metadata, batch.destination, true),
      );
    });
  }

  return [...batchResponseList, ...errorRespList];
};
