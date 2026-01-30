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
  getValueFromMessage,
  isDefinedAndNotNull,
  isAppleFamily,
} from '../../util';
import type {
  SingularMessage,
  SingularDestinationConfig,
  SingularProduct,
  SingularEventType,
  SingularPlatform,
  SingularBatchRequest,
  SingularPayload,
  SingularRequestParams,
  SingularSessionParams,
  SingularEventParams,
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
  EXCLUSION_FIELDS: string[],
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

const exclusionList: Record<string, string[]> = {
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
 * Builds base payload using platform-specific mapping configuration
 * @param message - RudderStack message
 * @param platform - Platform identifier (lowercased)
 * @param eventType - 'SESSION' or 'EVENT'
 * @returns Base payload from constructPayload
 * @throws TransformationError if payload creation fails
 */
const buildBasePayload = (
  message: SingularMessage,
  platform: SingularPlatform,
  eventType: SingularEventType,
): Record<string, unknown> => {
  const configKey = SUPPORTED_UNTIY_SUBPLATFORMS.includes(platform)
    ? CONFIG_CATEGORIES[`${eventType}_UNITY`].name
    : CONFIG_CATEGORIES[`${eventType}_${SUPPORTED_PLATFORM[platform]}`].name;

  const basePayload: Record<string, unknown> | null = constructPayload(
    message,
    MAPPING_CONFIG[configKey],
  ) as Record<string, unknown> | null;

  if (!basePayload) {
    throw new TransformationError(`Failed to Create ${platform} ${eventType} Payload`);
  }

  return basePayload;
};

/**
 * Computes match_id value based on configuration and message
 * Used for Unity platforms
 * @param message - RudderStack message
 * @param Config - Destination configuration
 * @returns match_id value or undefined
 */
const getMatchId = (
  message: SingularMessage,
  Config: SingularDestinationConfig,
): string | undefined => {
  if (Config.match_id === 'advertisingId') {
    return message?.context?.device?.advertisingId;
  }
  if (message.properties?.match_id) {
    return message.properties.match_id;
  }
  return undefined;
};

/**
 * Determines connection type based on message context
 * @param message - RudderStack message
 * @returns 'wifi' if network.wifi is true, otherwise 'carrier'
 */
const getConnectionType = (message: SingularMessage): 'wifi' | 'carrier' =>
  message.context?.network?.wifi ? 'wifi' : 'carrier';

/**
 * Creates a SESSION payload with session-specific parameters
 * @param message - RudderStack message
 * @param platform - Platform identifier (lowercased)
 * @param Config - Destination configuration
 * @returns SESSION payload conforming to SingularSessionParams
 */
const createSessionPayload = (
  message: SingularMessage,
  platform: SingularPlatform,
  Config: SingularDestinationConfig,
): SingularSessionParams => {
  const payload = buildBasePayload(
    message,
    platform,
    'SESSION',
  ) as unknown as SingularSessionParams;

  if (!SUPPORTED_UNTIY_SUBPLATFORMS.includes(platform)) {
    // context.device.adTrackingEnabled = true implies Singular's do not track (dnt) to be 0 and vice-versa.
    const adTrackingEnabled = getValueFromMessage(message, 'context.device.adTrackingEnabled');
    payload.dnt = adTrackingEnabled === true ? 0 : 1;

    // by default, the value of openuri and install_source should be "", i.e empty string if nothing is passed
    payload.openuri = message.properties?.url || '';
    if (platform === 'android') {
      payload.install_source = message.properties?.referring_application || '';
    }

    payload.c = getConnectionType(message);
  } else {
    const matchId = getMatchId(message, Config);
    if (matchId) {
      payload.match_id = matchId;
    }
  }

  return payload;
};

/**
 * Creates an EVENT payload with event-specific parameters and custom attributes
 * @param message - RudderStack message
 * @param platform - Platform identifier (lowercased)
 * @param Config - Destination configuration
 * @returns Object containing EVENT payload and optional event attributes
 */
const createEventPayload = (
  message: SingularMessage,
  platform: SingularPlatform,
  Config: SingularDestinationConfig,
): { payload: SingularEventParams; eventAttributes?: Record<string, unknown> } => {
  const payload = buildBasePayload(message, platform, 'EVENT') as unknown as SingularEventParams;
  let eventAttributes: Record<string, unknown> | undefined;

  if (!SUPPORTED_UNTIY_SUBPLATFORMS.includes(platform)) {
    // Custom Attributes is not supported by session events
    eventAttributes = extractExtraFields(
      message,
      exclusionList[`${SUPPORTED_PLATFORM[platform]}_EVENT_EXCLUSION_LIST`],
    );
    eventAttributes = removeUndefinedAndNullValues(eventAttributes);

    // If anyone out of value, revenue, total is set, we will have amt in payload
    // and we will consider the event as revenue event.
    if (!isDefinedAndNotNull(payload.is_revenue_event) && payload.amt) {
      payload.is_revenue_event = true;
    }

    payload.c = getConnectionType(message);
  } else {
    const matchId = getMatchId(message, Config);
    if (matchId) {
      payload.match_id = matchId;
    }
  }

  return { payload, eventAttributes };
};

/**
 * Generates platform-specific payload for Singular API
 * Handles both SESSION and EVENT payloads with appropriate parameters
 * @param message - RudderStack message
 * @param sessionEvent - Whether this is a session event
 * @param Config - Destination configuration
 * @returns Payload and optional event attributes for Singular API
 * @throws InstrumentationError if platform is missing or unsupported
 */
const platformWisePayloadGenerator = (
  message: SingularMessage,
  sessionEvent: boolean,
  Config: SingularDestinationConfig,
): SingularPayload => {
  const clonedMessage: SingularMessage = { ...message };
  let contextOsName = getValueFromMessage(clonedMessage, 'context.os.name');

  if (!contextOsName) {
    throw new InstrumentationError('Platform name is missing from context.os.name');
  }

  // checking if the os is one of ios, ipados, watchos, tvos
  if (typeof contextOsName === 'string' && isAppleFamily(contextOsName.toLowerCase())) {
    if (!clonedMessage.context) {
      clonedMessage.context = {};
    }
    if (!clonedMessage.context.os) {
      clonedMessage.context.os = {};
    }
    clonedMessage.context.os.name = 'iOS';
    contextOsName = 'iOS';
  }

  const platform = contextOsName.toLowerCase() as SingularPlatform;
  if (!SUPPORTED_PLATFORM[platform]) {
    throw new InstrumentationError(`Platform ${platform} is not supported`);
  }

  if (sessionEvent) {
    const payload = createSessionPayload(clonedMessage, platform, Config);
    return { payload, eventAttributes: undefined };
  }

  const { payload, eventAttributes } = createEventPayload(clonedMessage, platform, Config);
  return { payload, eventAttributes };
};

export { generateRevenuePayloadArray, isSessionEvent, platformWisePayloadGenerator };
