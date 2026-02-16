import {
  TransformationError,
  InstrumentationError,
  isEmptyObject,
} from '@rudderstack/integrations-lib';
import {
  BASE_URL_V1,
  BASE_URL_V2,
  CONFIG_CATEGORIES,
  CONFIG_CATEGORIES_V2,
  MAPPING_CONFIG,
  MAPPING_CONFIG_V2,
  SINGULAR_SESSION_ANDROID_EXCLUSION,
  SINGULAR_SESSION_IOS_EXCLUSION,
  SINGULAR_EVENT_ANDROID_EXCLUSION,
  SINGULAR_EVENT_IOS_EXCLUSION,
  SUPPORTED_PLATFORM,
  SUPPORTED_UNTIY_SUBPLATFORMS,
  SESSIONEVENTS,
  SINGULAR_V2_EVENT_ATTRIBUTES_EXCLUDED_KEYS,
  PARTNER_OBJECT,
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
  SingularEventType,
  SingularPlatform,
  SingularBatchRequest,
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
 * @param eventEndpoint - Endpoint for event requests (caller passes BASE_URL_V1/evt or BASE_URL_V2/evt)
 * @returns Array of revenue event batch requests
 */
const generateRevenuePayloadArray = (
  products: SingularProduct[],
  payload: SingularRequestParams,
  Config: SingularDestinationConfig,
  eventEndpoint: string,
): SingularBatchRequest[] =>
  products.map((product) => {
    const productDetails = constructPayload(
      product,
      MAPPING_CONFIG[CONFIG_CATEGORIES.PRODUCT_PROPERTY.name],
    );
    const finalPayload = removeUndefinedAndNullValues({
      ...payload,
      ...productDetails,
      ...PARTNER_OBJECT,
      a: Config.apiKey,
      is_revenue_event: true,
    }) as SingularEventParams;
    return {
      ...defaultRequestConfig(),
      endpoint: eventEndpoint,
      params: finalPayload,
      method: defaultGetRequestConfig.requestMethod,
    };
  });

const exclusionList: Record<string, readonly string[]> = {
  ANDROID_SESSION_EXCLUSION_LIST: SINGULAR_SESSION_ANDROID_EXCLUSION,
  IOS_SESSION_EXCLUSION_LIST: SINGULAR_SESSION_IOS_EXCLUSION,
  ANDROID_EVENT_EXCLUSION_LIST: SINGULAR_EVENT_ANDROID_EXCLUSION,
  IOS_EVENT_EXCLUSION_LIST: SINGULAR_EVENT_IOS_EXCLUSION,
};

/**
 * Reads integrations.Singular.singularDeviceId from the message.
 * Used for V2 event API version selection and sdid query param.
 */
const getSingularDeviceIdFromMessage = (message: SingularMessage): string | undefined => {
  const integrationsObj = getIntegrationsObj(message, 'singular' as any);
  const singularDeviceId = integrationsObj?.singularDeviceId;
  return typeof singularDeviceId === 'string' && singularDeviceId.length > 0
    ? singularDeviceId
    : undefined;
};

/**
 * True when the customer sends integrations.Singular.singularDeviceId (use V2 event API).
 * Used only for non-session events; session events always use V1 launch.
 */
const shouldUseV2EventApi = (message: SingularMessage): boolean =>
  getSingularDeviceIdFromMessage(message) !== undefined;

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

  const dataSharingOptions = getDataSharingOptionsFromMessage(message);
  return {
    ...basePayload,
    ...(dataSharingOptions && { data_sharing_options: dataSharingOptions }),
  };
};

/**
 * Builds base payload for V2 event API using data/v2 mapping configs (no platform device ids; sdid from integration options).
 */
const buildBasePayloadV2 = (
  message: SingularMessage,
  platform: SingularPlatform,
): Record<string, unknown> => {
  const configKey = SUPPORTED_UNTIY_SUBPLATFORMS.includes(platform)
    ? CONFIG_CATEGORIES_V2.EVENT_UNITY.name
    : CONFIG_CATEGORIES_V2[`EVENT_${SUPPORTED_PLATFORM[platform]}`].name;

  const basePayload: Record<string, unknown> | null = constructPayload(
    message,
    MAPPING_CONFIG_V2[configKey],
  ) as Record<string, unknown> | null;

  if (!basePayload) {
    throw new TransformationError(`Failed to Create ${platform} V2 EVENT Payload`);
  }

  const dataSharingOptions = getDataSharingOptionsFromMessage(message);
  return {
    ...basePayload,
    ...(dataSharingOptions && { data_sharing_options: dataSharingOptions }),
  };
};

/**
 * Computes match_id value based on configuration and message
 * Used for Unity platforms
 * @param message - RudderStack message
 * @param Config - Destination configuration
 * @returns match_id value or undefined
 */
const getMatchObject = (
  message: SingularMessage,
  Config: SingularDestinationConfig,
): { match_id: string } | undefined => {
  if (Config.match_id === 'advertisingId' && message?.context?.device?.advertisingId) {
    return { match_id: message?.context?.device?.advertisingId };
  }
  if (message.properties?.match_id) {
    return { match_id: message.properties.match_id };
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

    return {
      ...payload,
      ...(platform === 'android' && {
        install_source: message.properties?.referring_application || '',
      }),
      dnt: adTrackingEnabled === true ? 0 : 1,
      openuri: message.properties?.url || '',
      c: getConnectionType(message),
    };
  }

  const matchObject = getMatchObject(message, Config);
  return { ...payload, ...matchObject };
};

/**
 * Creates an EVENT payload with event-specific parameters and custom attributes (V1 API).
 */
const createEventPayload = (
  message: SingularMessage,
  platform: SingularPlatform,
  Config: SingularDestinationConfig,
): SingularEventParams => {
  const payload = buildBasePayload(message, platform, 'EVENT') as unknown as SingularEventParams;

  if (!SUPPORTED_UNTIY_SUBPLATFORMS.includes(platform)) {
    const eventAttributes = removeUndefinedAndNullValues(
      extractExtraFields(
        message,
        exclusionList[`${SUPPORTED_PLATFORM[platform]}_EVENT_EXCLUSION_LIST`],
      ),
    );
    return {
      ...payload,
      c: getConnectionType(message),
      ...(!isDefinedAndNotNull(payload.is_revenue_event) &&
        payload.amt && { is_revenue_event: true }),
      ...(!isEmptyObject(eventAttributes) && { e: eventAttributes }),
    };
  }
  const matchObject = getMatchObject(message, Config);
  return { ...payload, ...matchObject };
};

/**
 * Creates a V2 EVENT payload using data/v2 mapping (no platform device ids; sdid from integration options).
 * Event attributes (e) exclude singularDeviceId. match_id is preserved for Unity platforms (same as V1).
 */
const createV2EventPayload = (
  message: SingularMessage,
  platform: SingularPlatform,
  Config: SingularDestinationConfig,
): SingularEventParams => {
  const basePayload = buildBasePayloadV2(message, platform);
  const sdid = getSingularDeviceIdFromMessage(message);
  const payload = { ...basePayload, ...(sdid && { sdid }) } as unknown as SingularEventParams;

  if (!SUPPORTED_UNTIY_SUBPLATFORMS.includes(platform)) {
    const v2Exclusion = [
      ...exclusionList[`${SUPPORTED_PLATFORM[platform]}_EVENT_EXCLUSION_LIST`],
      ...SINGULAR_V2_EVENT_ATTRIBUTES_EXCLUDED_KEYS,
    ];
    const eventAttributes = removeUndefinedAndNullValues(extractExtraFields(message, v2Exclusion));

    return {
      ...payload,
      c: getConnectionType(message),
      ...(!isDefinedAndNotNull(payload.is_revenue_event) &&
        payload.amt && { is_revenue_event: true }),
      ...(!isEmptyObject(eventAttributes) && { e: eventAttributes }),
    };
  }
  const matchObject = getMatchObject(message, Config);
  return { ...payload, ...matchObject };
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
): SingularEventParams | SingularSessionParams => {
  const clonedMessage: SingularMessage = { ...message };
  const contextOsName = getValueFromMessage(message, 'context.os.name');
  if (!contextOsName || typeof contextOsName !== 'string') {
    throw new InstrumentationError('Platform name is missing from context.os.name');
  }

  // checking if the os is one of ios, ipados, watchos, tvos
  const isAppleOs = isAppleFamily(contextOsName.toLowerCase());
  const normalizedOsName = isAppleOs ? 'iOS' : contextOsName;

  clonedMessage.context!.os!.name = normalizedOsName;

  const platform = normalizedOsName.toLowerCase() as SingularPlatform;
  if (!SUPPORTED_PLATFORM[platform]) {
    throw new InstrumentationError(`Platform ${platform} is not supported`);
  }

  if (sessionEvent) {
    return createSessionPayload(clonedMessage, platform, Config);
  }

  if (shouldUseV2EventApi(clonedMessage)) {
    return createV2EventPayload(clonedMessage, platform, Config);
  }

  return createEventPayload(clonedMessage, platform, Config);
};

/**
 * Returns the Singular API endpoint for the given request type.
 */
const getEndpoint = (message: SingularMessage, sessionEvent: boolean): string => {
  if (sessionEvent) {
    return `${BASE_URL_V1}/launch`;
  }
  return shouldUseV2EventApi(message) ? `${BASE_URL_V2}/evt` : `${BASE_URL_V1}/evt`;
};

export { generateRevenuePayloadArray, getEndpoint, isSessionEvent, platformWisePayloadGenerator };
