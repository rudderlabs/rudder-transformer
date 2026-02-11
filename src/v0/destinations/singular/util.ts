import { TransformationError, InstrumentationError } from '@rudderstack/integrations-lib';
import {
  CONFIG_CATEGORIES,
  MAPPING_CONFIG,
  SINGULAR_SESSION_ANDROID_EXCLUSION,
  SINGULAR_SESSION_IOS_EXCLUSION,
  SINGULAR_EVENT_ANDROID_EXCLUSION,
  SINGULAR_EVENT_IOS_EXCLUSION,
  BASE_URL,
  SUPPORTED_PLATFORM,
  SUPPORTED_UNTIY_SUBPLATFORMS,
  SESSIONEVENTS,
} from './config';
import {
  constructPayload,
  defaultRequestConfig,
  defaultGetRequestConfig,
  removeUndefinedAndNullValues,
  extractCustomFields,
  getIntegrationsObj,
  getValueFromMessage,
  isDefinedAndNotNull,
  isAppleFamily,
} from '../../util';
import type {
  SingularMessage,
  SingularDestinationConfig,
  SingularProduct,
  SingularBatchRequest,
  SingularRequestParams,
  SingularEventParams,
  SingularPayload,
} from './types';

/**
 * Extracts custom event attributes from message properties
 * All fields in properties not directly mapped will be sent as custom event attributes
 * @param message - RudderStack message
 * @param EXCLUSION_FIELDS - Fields to exclude from extraction
 * @returns Custom event attributes
 */
const extractExtraFields = (
  message: SingularMessage,
  EXCLUSION_FIELDS: readonly string[],
): Record<string, unknown> => {
  const eventAttributes: Record<string, unknown> = {};
  extractCustomFields(message, eventAttributes, ['properties'], EXCLUSION_FIELDS);
  return eventAttributes;
};

/**
 * Generates an array of individual responses for each product in a revenue event
 * @param products - Array of products
 * @param payload - Common payload for each revenue event
 * @param Config - Destination configuration
 * @param eventAttributes - Optional custom event attributes
 * @returns Array of revenue event batch requests
 */
const generateRevenuePayloadArray = (
  products: SingularProduct[],
  payload: SingularRequestParams,
  Config: SingularDestinationConfig,
  eventAttributes?: Record<string, unknown>,
) => {
  const responseArray: SingularBatchRequest[] = [];
  products.forEach((product) => {
    const productDetails = constructPayload(
      product,
      MAPPING_CONFIG[CONFIG_CATEGORIES.PRODUCT_PROPERTY.name],
    );
    const finalPayload = removeUndefinedAndNullValues({
      ...payload,
      ...productDetails,
      a: Config.apiKey,
      // is_revenue_event will be true as here payload for a REVENUE event is being generated
      is_revenue_event: true,
    }) as SingularEventParams;

    const response: SingularBatchRequest = {
      ...defaultRequestConfig(),
      endpoint: `${BASE_URL}/evt`,
      params: finalPayload,
      method: defaultGetRequestConfig.requestMethod,
    };
    if (eventAttributes) {
      response.params = { ...response.params, e: eventAttributes };
    }
    responseArray.push(response);
  });
  return responseArray;
};

const exclusionList: Record<string, readonly string[]> = {
  ANDROID_SESSION_EXCLUSION_LIST: SINGULAR_SESSION_ANDROID_EXCLUSION,
  IOS_SESSION_EXCLUSION_LIST: SINGULAR_SESSION_IOS_EXCLUSION,
  ANDROID_EVENT_EXCLUSION_LIST: SINGULAR_EVENT_ANDROID_EXCLUSION,
  IOS_EVENT_EXCLUSION_LIST: SINGULAR_EVENT_IOS_EXCLUSION,
};

/**
 * Determines if the event is a session event
 * @param Config - Destination configuration
 * @param eventName - Event name to check
 * @returns True if event is a session event, false otherwise
 */
const isSessionEvent = (Config: SingularDestinationConfig, eventName: string): boolean => {
  const mappedSessionEvents = Config.sessionEventList?.map((item) => item.sessionEventName) ?? [];
  return mappedSessionEvents.includes(eventName) || SESSIONEVENTS.includes(eventName.toLowerCase());
};

/**
 * Reads integrations.Singular.limitDataSharing and returns data_sharing_options when it is a boolean.
 * Used for both /launch and /evt API requests.
 * @param message - RudderStack message
 * @returns data_sharing_options object when limitDataSharing is boolean, otherwise undefined
 */
const getDataSharingOptionsFromMessage = (
  message: SingularMessage,
): { limit_data_sharing: boolean } | undefined => {
  const integrationsObj = getIntegrationsObj(message, 'singular' as any);
  const limitDataSharing = integrationsObj?.limitDataSharing;
  if (typeof limitDataSharing === 'boolean') {
    return { limit_data_sharing: limitDataSharing };
  }
  return undefined;
};

/**
 * Based on platform of device this function generates payload for singular API
 * @param {*} message
 * @param {*} sessionEvent
 * @returns
 */
const platformWisePayloadGenerator = (
  message: SingularMessage,
  sessionEvent: boolean,
  Config: SingularDestinationConfig,
): SingularPayload => {
  let eventAttributes;
  const clonedMessage: SingularMessage = { ...message };
  let platform = getValueFromMessage(clonedMessage, 'context.os.name');
  if (!platform) {
    throw new InstrumentationError('Platform name is missing from context.os.name');
  }
  const typeOfEvent = sessionEvent ? 'SESSION' : 'EVENT';
  // checking if the os is one of ios, ipados, watchos, tvos
  if (typeof platform === 'string' && isAppleFamily(platform.toLowerCase())) {
    clonedMessage.context!.os!.name = 'iOS';
    platform = 'iOS';
  }
  platform = platform.toLowerCase();
  if (!SUPPORTED_PLATFORM[platform]) {
    throw new InstrumentationError(`Platform ${platform} is not supported`);
  }
  let payload;
  if (SUPPORTED_UNTIY_SUBPLATFORMS.includes(platform)) {
    payload = constructPayload(
      clonedMessage,
      MAPPING_CONFIG[CONFIG_CATEGORIES[`${typeOfEvent}_UNITY`].name],
    );
  } else {
    payload = constructPayload(
      clonedMessage,
      MAPPING_CONFIG[CONFIG_CATEGORIES[`${typeOfEvent}_${SUPPORTED_PLATFORM[platform]}`].name],
    );
  }

  if (!payload) {
    throw new TransformationError(`Failed to Create ${platform} ${typeOfEvent} Payload`);
  }

  if (!SUPPORTED_UNTIY_SUBPLATFORMS.includes(platform)) {
    if (sessionEvent) {
      // context.device.adTrackingEnabled = true implies Singular's do not track (dnt)
      // to be 0 and vice-versa.
      const adTrackingEnabled = getValueFromMessage(
        clonedMessage,
        'context.device.adTrackingEnabled',
      );
      if (adTrackingEnabled === true) {
        payload.dnt = 0;
      } else {
        payload.dnt = 1;
      }
      // by default, the value of openuri and install_source should be "", i.e empty string if nothing is passed
      payload.openuri = clonedMessage.properties?.url || '';
      if (platform === 'android' || platform === 'Android') {
        payload.install_source = clonedMessage.properties?.referring_application || '';
      }
    } else {
      // Custom Attribues is not supported by session events
      eventAttributes = extractExtraFields(
        clonedMessage,
        exclusionList[`${SUPPORTED_PLATFORM[platform]}_${typeOfEvent}_EXCLUSION_LIST`],
      );
      eventAttributes = removeUndefinedAndNullValues(eventAttributes);

      // If anyone out of value, revenue, total is set,we will have amt in payload
      // and we will consider the event as revenue event.
      if (!isDefinedAndNotNull(payload.is_revenue_event) && payload.amt) {
        payload.is_revenue_event = true;
      }
    }

    // Singular maps Connection Type to either wifi or carrier
    if (clonedMessage.context?.network?.wifi) {
      payload.c = 'wifi';
    } else {
      payload.c = 'carrier';
    }
  } else if (Config.match_id === 'advertisingId') {
    payload.match_id = clonedMessage?.context?.device?.advertisingId;
  } else if (message.properties?.match_id) {
    payload.match_id = message.properties.match_id;
  }
  const dataSharingOptions = getDataSharingOptionsFromMessage(message);
  if (dataSharingOptions) {
    payload = {
      ...payload,
      data_sharing_options: dataSharingOptions,
    };
  }
  return { payload, eventAttributes };
};

export { generateRevenuePayloadArray, isSessionEvent, platformWisePayloadGenerator };
