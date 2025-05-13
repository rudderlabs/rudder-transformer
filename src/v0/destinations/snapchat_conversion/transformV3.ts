import get from 'get-value';
import { InstrumentationError } from '@rudderstack/integrations-lib';
import validator from 'validator';
import { EventType } from '../../../constants';

import {
  defaultPostRequestConfig,
  constructPayload,
  defaultRequestConfig,
  removeUndefinedAndNullValues,
  getFieldValueFromMessage,
  handleRtTfSingleEventError,
  getEventType,
} from '../../util';
import {
  ENDPOINT,
  eventNameMapping,
  mappingConfigV3,
  pageTypeToTrackEvent,
  ConfigCategoryV3,
} from './config';
import {
  getHashedValue,
  getItemIds,
  getPriceSum,
  getDataUseValue,
  getNormalizedPhoneNumber,
  eventMappingHandler,
  getEventConversionType,
  validateEventConfiguration,
  getEventTimestamp,
} from './util';
import { JSON_MIME_TYPE } from '../../util/constant';
import { batchResponseBuilder, getExtInfo } from './utilsV3';
import {
  SnapchatDestination,
  SnapchatV3ProcessedEvent,
  SnapchatV3Payload,
  SnapchatV3BatchedRequest,
  CommonProcessPayloadConfig,
  SnapchatRouterRequest,
  SnapchatV3EventData,
  SnapchatV3BatchRequestOutput,
  MappingConfig,
} from './types';
import { RudderMessage } from '../../../types';

/**
 * Builds a response object for the Snapchat V3 API
 * @param apiKey - The API key for authentication
 * @param payload - The payload to send to Snapchat
 * @param ID - The pixel ID or app ID depending on the event type
 * @returns A formatted request object with proper headers and endpoint configuration
 */
function buildResponse(
  apiKey: string,
  payload: SnapchatV3Payload,
  ID: string,
): SnapchatV3BatchedRequest {
  const response = defaultRequestConfig();
  response.endpoint = ENDPOINT.Endpoint_v3.replace('{ID}', ID);
  response.headers = {
    'Content-Type': JSON_MIME_TYPE,
  };
  response.params = {
    access_token: apiKey,
  };
  response.method = defaultPostRequestConfig.requestMethod;
  response.body.JSON = payload;
  return response as SnapchatV3BatchedRequest;
}

/**
 * Populates hashed trait values in the payload for V3 API
 * @param payload - The payload to populate
 * @param message - The message containing the traits
 * @returns The updated payload with hashed trait values for first name, last name, etc.
 */
const populateHashedTraitsValues = (
  payload: SnapchatV3Payload,
  message: RudderMessage,
): SnapchatV3Payload => {
  const updatedPayload: SnapchatV3Payload = { ...payload };
  const userData = updatedPayload.data[0].user_data || {};

  const getHashedTrait = (value: any): string | undefined => {
    if (!value) return undefined;
    const trimmed = value.toString().trim().toLowerCase();
    if (!trimmed) return undefined;
    const hashedValue = getHashedValue(trimmed);
    return hashedValue || undefined;
  };

  updatedPayload.data[0].user_data = {
    ...userData,
    fn: getHashedTrait(getFieldValueFromMessage(message, 'firstName')),
    ln: getHashedTrait(getFieldValueFromMessage(message, 'lastName')),
    ge: getHashedTrait(getFieldValueFromMessage(message, 'gender')),
    ct: getHashedTrait(getFieldValueFromMessage(message, 'city')),
    zp: getHashedTrait(getFieldValueFromMessage(message, 'zipcode')),
    st: getHashedTrait(getFieldValueFromMessage(message, 'state')),
    country: getHashedTrait(getFieldValueFromMessage(message, 'country')),
  };

  return updatedPayload;
};

/**
 * Populates all hashed values in the payload for V3 API
 * @param payload - The payload to populate with hashed values
 * @param message - The message containing the values to hash
 * @returns The payload with hashed values for email, phone, and other user identifiers
 */
const populateHashedValues = (
  payload: SnapchatV3Payload,
  message: RudderMessage,
): SnapchatV3Payload => {
  const updatedPayload: SnapchatV3Payload = populateHashedTraitsValues(payload, message);
  const userData = updatedPayload.data[0].user_data || {};

  const email = getFieldValueFromMessage(message, 'emailOnly');
  const trimmedEmail = email?.toString().toLowerCase().trim();
  if (trimmedEmail && validator.isEmail(trimmedEmail)) {
    userData.em = getHashedValue(trimmedEmail);
  }

  const phone = getNormalizedPhoneNumber(message);
  const trimmedPhone = phone?.toString().toLowerCase().trim();
  if (trimmedPhone) {
    userData.ph = getHashedValue(trimmedPhone);
  }

  updatedPayload.data[0].user_data = userData;

  return updatedPayload;
};

/**
 * Safely constructs payload from message and mapping config for V3 API
 * @param message - The message containing the event data
 * @param configMapping - The mapping configuration to use
 * @returns The constructed payload or empty object if null
 */
const getPayloadFromMapping = (
  message: RudderMessage,
  configMapping: MappingConfig,
): Partial<SnapchatV3EventData> => constructPayload(message, configMapping) || {};

/**
 * Gets common properties for all events in V3 API
 * @param message - The message to extract properties from
 * @returns Common properties that should be included in all event payloads
 */
const getEventCommonProperties = (message: RudderMessage): Partial<SnapchatV3EventData> =>
  getPayloadFromMapping(message, mappingConfigV3[ConfigCategoryV3.TRACK_COMMON.name]);

/**
 * Validates that required fields are present in the V3 payload
 * @param payload - The payload to validate
 * @throws InstrumentationError if required fields are missing (email, phone, advertisingId, or IP + userAgent)
 */
const validateRequiredFields = (payload: SnapchatV3Payload): void => {
  const userData = payload.data?.[0]?.user_data || {};
  const hasRequiredFields =
    userData.em ||
    userData.ph ||
    userData.madid ||
    (userData.client_ip_address && userData.client_user_agent);

  if (!hasRequiredFields) {
    throw new InstrumentationError(
      'At least one of email or phone or advertisingId or ip and clientUserAgent is required',
    );
  }
};

/**
 * Adds specific event details to the V3 payload based on the action source
 * @param message - The message containing the event
 * @param payload - The payload to add details to
 * @param actionSource - The source of the event (WEB, MOBILE_APP, OFFLINE)
 * @param pixelId - The pixel ID for web events
 * @param snapAppId - The Snap app ID for mobile events
 * @param appId - The app ID for mobile events
 * @returns The updated payload with specific event details based on action source
 */
const addSpecificEventDetails = (
  message: RudderMessage,
  payload: SnapchatV3Payload,
  actionSource: string,
  pixelId?: string,
  snapAppId?: string,
  appId?: string,
): SnapchatV3Payload => {
  const updatedPayload: SnapchatV3Payload = { ...payload };

  if (actionSource === 'WEB') {
    updatedPayload.data[0].event_source_url = getFieldValueFromMessage(message, 'pageUrl');
  }

  if (actionSource === 'MOBILE_APP') {
    if (!updatedPayload.data[0].app_data) {
      updatedPayload.data[0].app_data = {};
    }
    updatedPayload.data[0].app_data.app_id = appId;
    const extInfo = getExtInfo(message);
    if (extInfo) {
      updatedPayload.data[0].app_data.extinfo = extInfo;
    }
  }

  return updatedPayload;
};

/**
 * Gets the appropriate event configuration based on event type
 * @param eventType - The type of event
 * @returns The mapping configuration for the specified event type
 */
const getEventConfig = (eventType: string): any => {
  const configMap: Record<string, any> = {
    products_searched: mappingConfigV3[ConfigCategoryV3.PRODUCTS_SEARCHED.name],
    product_list_viewed: mappingConfigV3[ConfigCategoryV3.PRODUCT_LIST_VIEWED.name],
    promotion_viewed: mappingConfigV3[ConfigCategoryV3.PROMOTION_VIEWED.name],
    promotion_clicked: mappingConfigV3[ConfigCategoryV3.PROMOTION_CLICKED.name],
    product_viewed: mappingConfigV3[ConfigCategoryV3.PRODUCT_VIEWED.name],
    checkout_started: mappingConfigV3[ConfigCategoryV3.CHECKOUT_STARTED.name],
    payment_info_entered: mappingConfigV3[ConfigCategoryV3.PAYMENT_INFO_ENTERED.name],
    order_completed: mappingConfigV3[ConfigCategoryV3.ORDER_COMPLETED.name],
    product_added: mappingConfigV3[ConfigCategoryV3.PRODUCT_ADDED.name],
    product_added_to_wishlist: mappingConfigV3[ConfigCategoryV3.PRODUCT_ADDED_TO_WISHLIST.name],
    sign_up: mappingConfigV3[ConfigCategoryV3.SIGN_UP.name],
  };

  return configMap[eventType] || mappingConfigV3[ConfigCategoryV3.DEFAULT.name];
};

/**
 * Checks if the event is a product-related event
 * @param eventType - The type of event
 * @returns True if the event is product-related, false otherwise
 */
const isProductEvent = (eventType: string): boolean =>
  ['product_list_viewed', 'checkout_started', 'order_completed'].includes(eventType);

/**
 * Builds the base payload for an event in V3 API
 * @param message - The message containing the event
 * @param event - The event name
 * @returns A base payload with common event properties
 */
const buildBasePayload = (message: RudderMessage, event: string): SnapchatV3Payload => {
  const payload: SnapchatV3Payload = { data: [{}] };
  const eventType = event.toLowerCase();
  const eventConfig = getEventConfig(eventType);

  payload.data[0] = getPayloadFromMapping(message, eventConfig);
  payload.data[0].event_name = eventNameMapping[eventType];

  // Handle special cases for product events
  if (isProductEvent(eventType)) {
    if (!payload.data[0].custom_data) {
      payload.data[0].custom_data = {};
    }
    payload.data[0].custom_data.content_ids = getItemIds(message) || undefined;
    payload.data[0].custom_data.value =
      payload.data[0].custom_data.value || getPriceSum(message) || undefined;
  }

  return payload;
};

/**
 * Processes a payload for the V3 API
 * @param payload - The payload to process
 * @param message - The message containing the event
 * @param config - Configuration for processing the payload
 * @returns The processed payload with all required fields
 */
const processPayload = (
  payload: SnapchatV3Payload,
  message: RudderMessage,
  config: CommonProcessPayloadConfig,
): SnapchatV3Payload => {
  const { actionSource, pixelId, snapAppId, appId, enableDeduplication, deduplicationKey } = config;

  let processedPayload: SnapchatV3Payload = populateHashedValues(payload, message);
  validateRequiredFields(processedPayload);

  processedPayload.data[0].event_time = getEventTimestamp(message, 7) || undefined;
  processedPayload.data[0].data_processing_options = getDataUseValue(message) || undefined;
  processedPayload.data[0].action_source = actionSource;

  processedPayload = addSpecificEventDetails(
    message,
    processedPayload,
    actionSource,
    pixelId,
    snapAppId,
    appId,
  );

  if (enableDeduplication) {
    const eventId = deduplicationKey || 'messageId';
    processedPayload.data[0].event_id = get(message, eventId);
  }

  processedPayload.data[0] = removeUndefinedAndNullValues(processedPayload.data[0]);
  return processedPayload;
};

/**
 * Builds a response for a track event in V3 API
 * @param message - The message containing the event
 * @param destination - The destination configuration
 * @param mappedEvent - The mapped event name
 * @returns A formatted request object with all required Snapchat parameters
 */
const trackResponseBuilder = (
  message: RudderMessage,
  destination: SnapchatDestination,
  mappedEvent: string,
): SnapchatV3BatchedRequest => {
  const { apiKey, pixelId, snapAppId, appId, deduplicationKey, enableDeduplication } =
    destination.Config;
  const event = mappedEvent?.toString().trim().replace(/\s+/g, '_');
  const actionSource = getEventConversionType(message);

  validateEventConfiguration(actionSource, pixelId, snapAppId, appId);

  if (!eventNameMapping[event.toLowerCase()]) {
    throw new InstrumentationError(`Event ${event} doesn't match with Snapchat Events!`);
  }

  const payload: SnapchatV3Payload = buildBasePayload(message, event);
  const commonProperties: Partial<SnapchatV3EventData> = getEventCommonProperties(message);

  // Merge common properties with payload
  if (commonProperties?.user_data) {
    payload.data[0].user_data = { ...payload.data[0]?.user_data, ...commonProperties.user_data };
  }
  if (commonProperties?.custom_data) {
    payload.data[0].custom_data = {
      ...payload.data[0]?.custom_data,
      ...commonProperties.custom_data,
    };
  }

  // Process and validate payload
  const processedPayload: SnapchatV3Payload = processPayload(payload, message, {
    actionSource,
    pixelId,
    snapAppId,
    appId,
    enableDeduplication,
    deduplicationKey,
  });

  const ID = actionSource === 'MOBILE_APP' ? (snapAppId as string) : (pixelId as string);
  return buildResponse(apiKey, processedPayload, ID);
};

/**
 * Handles page events for V3 API
 * @param message - The message containing the page event
 * @param destination - The destination configuration
 * @returns A formatted request object for the page event
 */
const handlePageEvent = (
  message: RudderMessage,
  destination: SnapchatDestination,
): SnapchatV3BatchedRequest => trackResponseBuilder(message, destination, pageTypeToTrackEvent);

/**
 * Handles track events for V3 API
 * @param message - The message containing the track event
 * @param destination - The destination configuration
 * @returns A formatted request object for the track event
 */
const handleTrackEvent = (
  message: RudderMessage,
  destination: SnapchatDestination,
): SnapchatV3BatchedRequest => {
  const mappedEvents: string[] = eventMappingHandler(message, destination);

  if (mappedEvents.length > 0) {
    const responses: SnapchatV3BatchedRequest[] = mappedEvents.map((mappedEvent: string) =>
      trackResponseBuilder(message, destination, mappedEvent),
    );

    if (responses.length > 0 && responses[0]?.body?.JSON) {
      responses[0].body.JSON.data = responses.flatMap(
        (response) => response?.body?.JSON?.data || [],
      );
    }
    return responses[0];
  }

  return trackResponseBuilder(message, destination, get(message, 'event'));
};

/**
 * Processes a single event for Snapchat Conversion API V3
 * @param event - The event to process
 * @returns A formatted request object for the V3 API
 * @throws InstrumentationError if event type is not supported or required fields are missing
 */
const processV3 = (event: SnapchatRouterRequest): SnapchatV3BatchedRequest => {
  const { message, destination } = event;
  const messageType = getEventType(message);

  if (!messageType) {
    throw new InstrumentationError('Event type is required');
  }

  if (messageType === EventType.PAGE) {
    return handlePageEvent(message, destination);
  }

  if (messageType === EventType.TRACK) {
    return handleTrackEvent(message, destination);
  }

  throw new InstrumentationError(`Event type ${messageType} is not supported`);
};

/**
 * Processes multiple events for Snapchat Conversion API V3
 * @param inputs - Array of events to process
 * @param reqMetadata - Request metadata
 * @returns Array of processed events and error responses
 */
const processRouterDest = async (inputs: SnapchatRouterRequest[], reqMetadata: any) => {
  const webOrOfflineEventsChunk: SnapchatV3ProcessedEvent[] = [];
  const mobileEventsChunk: SnapchatV3ProcessedEvent[] = [];
  const errorRespList: any[] = [];

  inputs.forEach((event) => {
    try {
      const actionSource = getEventConversionType(event.message);
      const resp = {
        message: processV3(event),
        metadata: event.metadata,
        destination: event.destination,
      };
      if (actionSource === 'MOBILE_APP') {
        mobileEventsChunk.push(resp);
      } else {
        webOrOfflineEventsChunk.push(resp);
      }
    } catch (error) {
      const errRespEvent = handleRtTfSingleEventError(event, error, reqMetadata);
      errorRespList.push(errRespEvent);
    }
  });

  const batchResponseList: SnapchatV3BatchRequestOutput[] = batchResponseBuilder(
    webOrOfflineEventsChunk,
    mobileEventsChunk,
  );

  return [...batchResponseList, ...errorRespList];
};

export { processV3, processRouterDest };
