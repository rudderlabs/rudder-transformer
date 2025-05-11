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
import {
  SnapchatDestination,
  EventConversionTypeValue,
  SnapchatRouterRequest,
  SnapchatV2BatchedRequest,
  SnapchatV3BatchedRequest,
  SnapchatV2Payload,
  SnapchatV2ProcessedEvent,
  SnapchatV2BatchRequestOutput,
  ApiVersionValue,
} from './types';
import { RudderMessage } from '../../../types';

/**
 * Builds a response object for the Snapchat V2 API
 * @param apiKey - The API key for authentication
 * @param payload - The payload to send to Snapchat
 * @returns A formatted request object with proper headers and endpoint configuration
 */
function buildResponse(apiKey: string, payload: SnapchatV2Payload): SnapchatV2BatchedRequest {
  const response = defaultRequestConfig();
  response.endpoint = ENDPOINT.Endpoint_v2;
  response.headers = {
    Authorization: `Bearer ${apiKey}`,
    'Content-Type': JSON_MIME_TYPE,
  };
  response.method = defaultPostRequestConfig.requestMethod;
  response.body.JSON = removeUndefinedAndNullValues(payload);
  return response as SnapchatV2BatchedRequest;
}

/**
 * Populates hashed trait values in the payload
 * @param payload - The payload to populate
 * @param message - The message containing the traits
 * @returns The updated payload with hashed trait values for first name, last name, etc.
 */
const populateHashedTraitsValues = (
  payload: SnapchatV2Payload,
  message: RudderMessage,
): SnapchatV2Payload => {
  const firstName = getFieldValueFromMessage(message, 'firstName');
  const lastName = getFieldValueFromMessage(message, 'lastName');
  const middleName = getFieldValueFromMessage(message, 'middleName');
  const city = getFieldValueFromMessage(message, 'city');
  const state = getFieldValueFromMessage(message, 'state');
  const zip = getFieldValueFromMessage(message, 'zipcode');
  const updatedPayload: SnapchatV2Payload = {
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
 * Separate out hashing operations into one function
 * @param payload - The payload to populate with hashed values
 * @param message - The message containing the values to hash
 * @returns The payload with hashed values for email, phone, IP, and device identifiers
 */
const populateHashedValues = (
  payload: SnapchatV2Payload,
  message: RudderMessage,
): SnapchatV2Payload => {
  const email = getFieldValueFromMessage(message, 'email');
  const phone = getNormalizedPhoneNumber(message);
  const ip = get(message, 'context.ip') || message.request_ip;

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
    isAppleFamily(get(message, 'context.device.type')) &&
    (get(message, 'properties.idfv') || get(message, 'context.device.id'))
  ) {
    updatedPayload.hashed_idfv = getHashedValue(
      get(message, 'properties.idfv') || get(message, 'context.device.id'),
    );
  }

  if (get(message, 'properties.adId') || get(message, 'context.device.advertisingId')) {
    updatedPayload.hashed_mobile_ad_id = getHashedValue(
      get(message, 'properties.adId') || get(message, 'context.device.advertisingId'),
    );
  }
  return updatedPayload;
};

/**
 * Safely constructs payload from message and mapping config
 * @param message - The message containing the event data
 * @param configMapping - The mapping configuration to use
 * @returns The constructed payload or empty object if null
 */
const getPayloadFromMapping = (
  message: RudderMessage,
  configMapping: any,
): Partial<SnapchatV2Payload> => constructPayload(message, configMapping) || {};

/**
 * Gets common properties for all events
 * @param message - The message to extract properties from
 * @returns Common properties that should be included in all event payloads
 */
const getEventCommonProperties = (message: RudderMessage): Partial<SnapchatV2Payload> =>
  getPayloadFromMapping(message, mappingConfig[ConfigCategory.TRACK_COMMON.name]);

/**
 * Validates that required fields are present in the payload
 * @param payload - The payload to validate
 * @throws InstrumentationError if required fields are missing (email, phone, advertisingId, or IP + userAgent)
 */
const validateRequiredFields = (payload: SnapchatV2Payload): void => {
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

/**
 * Adds specific event details to the payload based on the event conversion type
 * @param message - The message containing the event
 * @param payload - The payload to add details to
 * @param eventConversionType - The type of event conversion (WEB, MOBILE_APP, OFFLINE)
 * @param pixelId - The pixel ID for web events
 * @param snapAppId - The Snap app ID for mobile events
 * @param appId - The app ID for mobile events
 * @returns The updated payload with specific event details based on conversion type
 */
const addSpecificEventDetails = (
  message: RudderMessage,
  payload: SnapchatV2Payload,
  eventConversionType: EventConversionTypeValue,
  pixelId?: string,
  snapAppId?: string,
  appId?: string,
): SnapchatV2Payload => {
  const updatedPayload: SnapchatV2Payload = { ...payload };
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

/**
 * Builds a response for a track event
 * @param message - The message containing the event
 * @param destination - The destination configuration
 * @param mappedEvent - The mapped event name
 * @returns A formatted request object with all required Snapchat parameters
 */
const trackResponseBuilder = (
  message: RudderMessage,
  destination: SnapchatDestination,
  mappedEvent: string,
): SnapchatV2BatchedRequest => {
  let payload: SnapchatV2Payload = {};
  const event = mappedEvent?.toString().trim().replace(/\s+/g, '_');
  const eventConversionType = getEventConversionType(message);
  const { apiKey, pixelId, snapAppId, appId, deduplicationKey, enableDeduplication } =
    destination.Config;
  validateEventConfiguration(eventConversionType, pixelId, snapAppId, appId);

  if (eventNameMapping[event.toLowerCase()]) {
    // Snapchat standard events
    // get event specific parameters
    switch (event.toLowerCase()) {
      /* Browsing Section */
      case 'products_searched':
        payload = getPayloadFromMapping(
          message,
          mappingConfig[ConfigCategory.PRODUCTS_SEARCHED.name],
        );
        payload.event_type = eventNameMapping[event.toLowerCase()];
        break;
      case 'product_list_viewed':
        payload = getPayloadFromMapping(
          message,
          mappingConfig[ConfigCategory.PRODUCT_LIST_VIEWED.name],
        );
        payload.event_type = eventNameMapping[event.toLowerCase()];
        payload.item_ids = getItemIds(message) || undefined;
        payload.price = payload.price || getPriceSum(message);
        break;
      /* Promotions Section */
      case 'promotion_viewed':
        payload = getPayloadFromMapping(
          message,
          mappingConfig[ConfigCategory.PROMOTION_VIEWED.name],
        );
        payload.event_type = eventNameMapping[event.toLowerCase()];
        break;
      case 'promotion_clicked':
        payload = getPayloadFromMapping(
          message,
          mappingConfig[ConfigCategory.PROMOTION_CLICKED.name],
        );
        payload.event_type = eventNameMapping[event.toLowerCase()];
        break;
      /* Ordering Section */
      case 'product_viewed':
        payload = getPayloadFromMapping(message, mappingConfig[ConfigCategory.PRODUCT_VIEWED.name]);
        payload.event_type = eventNameMapping[event.toLowerCase()];
        break;
      case 'checkout_started':
        payload = getPayloadFromMapping(
          message,
          mappingConfig[ConfigCategory.CHECKOUT_STARTED.name],
        );
        payload.event_type = eventNameMapping[event.toLowerCase()];
        payload.item_ids = getItemIds(message) || undefined;
        payload.price = payload.price || getPriceSum(message);
        break;
      case 'payment_info_entered':
        payload = getPayloadFromMapping(
          message,
          mappingConfig[ConfigCategory.PAYMENT_INFO_ENTERED.name],
        );
        payload.event_type = eventNameMapping[event.toLowerCase()];
        break;
      case 'order_completed':
        payload = getPayloadFromMapping(
          message,
          mappingConfig[ConfigCategory.ORDER_COMPLETED.name],
        );
        payload.event_type = eventNameMapping[event.toLowerCase()];
        payload.item_ids = getItemIds(message) || undefined;
        payload.price = payload.price || getPriceSum(message);
        break;
      case 'product_added':
        payload = getPayloadFromMapping(message, mappingConfig[ConfigCategory.PRODUCT_ADDED.name]);
        payload.event_type = eventNameMapping[event.toLowerCase()];
        break;
      /* Wishlist Section */
      case 'product_added_to_wishlist':
        payload = getPayloadFromMapping(
          message,
          mappingConfig[ConfigCategory.PRODUCT_ADDED_TO_WISHLIST.name],
        );
        payload.event_type = eventNameMapping[event.toLowerCase()];
        break;
      /* Snapchat General Events */
      case 'sign_up':
        payload = getPayloadFromMapping(message, mappingConfig[ConfigCategory.SIGN_UP.name]);
        payload.event_type = eventNameMapping[event.toLowerCase()];
        break;
      default:
        payload = getPayloadFromMapping(message, mappingConfig[ConfigCategory.DEFAULT.name]);
        payload.event_type = eventNameMapping[event.toLowerCase()];
        break;
    }
  } else {
    throw new InstrumentationError(`Event ${event} doesn't match with Snapchat Events!`);
  }

  payload = { ...payload, ...getEventCommonProperties(message) };
  payload = populateHashedValues(payload, message);
  validateRequiredFields(payload);
  payload.timestamp = getEventTimestamp(message) || undefined;
  payload.data_use = getDataUseValue(message) || undefined;

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

/**
 * Processes a single event for Snapchat Conversion API
 * @param event - The event to process
 * @returns A formatted request object or array of request objects based on API version
 * @throws InstrumentationError if event type is not supported or required fields are missing
 */
export const process = (
  event: SnapchatRouterRequest,
): SnapchatV2BatchedRequest | SnapchatV2BatchedRequest[] | SnapchatV3BatchedRequest => {
  const { message, destination } = event;
  const apiVersion = destination.Config?.apiVersion as ApiVersionValue;

  if (apiVersion === API_VERSION.V3) {
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

/**
 * Processes multiple events for router destination
 * @param inputs - The events to process
 * @param reqMetadata - Request metadata
 * @returns An array of batch request outputs
 */
const processRouterDest = async (inputs: SnapchatRouterRequest[], reqMetadata: any) => {
  const { destination } = inputs[0];
  const apiVersion = destination.Config?.apiVersion as ApiVersionValue;

  if (apiVersion === API_VERSION.V3) {
    return processRouterV3(inputs, reqMetadata);
  }

  const eventsChunk: SnapchatV2ProcessedEvent[] = []; // temporary variable to divide payload into chunks
  const errorRespList: any[] = [];
  inputs.forEach((event) => {
    try {
      const resp = process(event);
      eventsChunk.push({
        message: (Array.isArray(resp) ? resp : [resp]) as SnapchatV2BatchedRequest[],
        metadata: event.metadata,
        destination: event.destination,
      });
    } catch (error) {
      const errRespEvent = handleRtTfSingleEventError(event, error, reqMetadata);
      errorRespList.push(errRespEvent);
    }
  });

  const batchResponseList: SnapchatV2BatchRequestOutput[] = [];
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

export { processRouterDest };
