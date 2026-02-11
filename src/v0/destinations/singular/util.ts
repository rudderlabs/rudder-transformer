import { TransformationError, InstrumentationError } from '@rudderstack/integrations-lib';
import {
  BASE_URL,
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
  isEmptyObject,
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
 * @param eventEndpoint - Endpoint for event requests (caller passes BASE_URL/evt or BASE_URL_V2/evt)
 * @returns Array of revenue event batch requests
 */
const generateRevenuePayloadArray = (
  products: SingularProduct[],
  payload: SingularRequestParams,
  Config: SingularDestinationConfig,
  eventAttributes: Record<string, unknown> | undefined,
  eventEndpoint: string,
): SingularBatchRequest[] => {
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
      is_revenue_event: true,
      ...PARTNER_OBJECT,
    }) as SingularEventParams;

    const response: SingularBatchRequest = {
      ...defaultRequestConfig(),
      endpoint: eventEndpoint,
      params: finalPayload,
      method: defaultGetRequestConfig.requestMethod,
    };
    if (!isEmptyObject(eventAttributes)) {
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

/** V2 API: exclude singularDeviceId from event attributes (e) to avoid duplicating sdid query param */
const SINGULAR_V2_EVENT_ATTRIBUTE_EXCLUSION_EXTRA = ['singularDeviceId'];

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
  getSingularDeviceIdFromMessage(message) != null;

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
 * Builds base payload for V2 event API using data/v2 mapping configs (no platform device ids; sdid from integration options).
 */
const buildBasePayloadV2 = (
  message: SingularMessage,
  platform: SingularPlatform,
): Record<string, unknown> => {
  const configKey = SUPPORTED_UNTIY_SUBPLATFORMS.includes(platform)
    ? CONFIG_CATEGORIES_V2.EVENT_UNITY_V2.name
    : CONFIG_CATEGORIES_V2[`EVENT_${SUPPORTED_PLATFORM[platform]}_V2`].name;

  const basePayload: Record<string, unknown> | null = constructPayload(
    message,
    MAPPING_CONFIG_V2[configKey],
  ) as Record<string, unknown> | null;

  if (!basePayload) {
    throw new TransformationError(`Failed to Create ${platform} V2 EVENT Payload`);
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

  const dataSharingOptions = getDataSharingOptionsFromMessage(message);
  if (dataSharingOptions) {
    payload.data_sharing_options = dataSharingOptions;
  }
  return payload;
};

/**
 * Creates an EVENT payload with event-specific parameters and custom attributes (V1 API).
 */
const createEventPayload = (
  message: SingularMessage,
  platform: SingularPlatform,
  Config: SingularDestinationConfig,
): { payload: SingularEventParams; eventAttributes?: Record<string, unknown> } => {
  const payload = buildBasePayload(message, platform, 'EVENT') as unknown as SingularEventParams;
  let eventAttributes: Record<string, unknown> | undefined;

  if (!SUPPORTED_UNTIY_SUBPLATFORMS.includes(platform)) {
    eventAttributes = extractExtraFields(
      message,
      exclusionList[`${SUPPORTED_PLATFORM[platform]}_EVENT_EXCLUSION_LIST`],
    );
    eventAttributes = removeUndefinedAndNullValues(eventAttributes);

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

  const dataSharingOptions = getDataSharingOptionsFromMessage(message);
  if (dataSharingOptions) {
    payload.data_sharing_options = dataSharingOptions;
  }
  return { payload, eventAttributes };
};

/**
 * Creates a V2 EVENT payload using data/v2 mapping (no platform device ids; sdid from integration options).
 * Event attributes (e) exclude singularDeviceId. match_id is preserved for Unity platforms (same as V1).
 */
const createV2EventPayload = (
  message: SingularMessage,
  platform: SingularPlatform,
  Config: SingularDestinationConfig,
): { payload: SingularEventParams; eventAttributes?: Record<string, unknown> } => {
  const basePayload = buildBasePayloadV2(message, platform);
  const sdid = getSingularDeviceIdFromMessage(message);
  if (sdid) {
    basePayload.sdid = sdid;
  }
  const payload = basePayload as unknown as SingularEventParams;
  let eventAttributes: Record<string, unknown> | undefined;

  if (!SUPPORTED_UNTIY_SUBPLATFORMS.includes(platform)) {
    const platformExclusion = exclusionList[`${SUPPORTED_PLATFORM[platform]}_EVENT_EXCLUSION_LIST`];
    const v2Exclusion = [...platformExclusion, ...SINGULAR_V2_EVENT_ATTRIBUTE_EXCLUSION_EXTRA];
    eventAttributes = extractExtraFields(message, v2Exclusion);
    eventAttributes = removeUndefinedAndNullValues(eventAttributes);

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

  const dataSharingOptions = getDataSharingOptionsFromMessage(message);
  if (dataSharingOptions) {
    payload.data_sharing_options = dataSharingOptions;
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

  if (shouldUseV2EventApi(clonedMessage)) {
    const { payload, eventAttributes } = createV2EventPayload(clonedMessage, platform, Config);
    return { payload, eventAttributes };
  }

  const { payload, eventAttributes } = createEventPayload(clonedMessage, platform, Config);

  return { payload, eventAttributes };
};

/**
 * Returns the Singular API endpoint for the given request type.
 * Session events use V1 launch; non-session events use V2 evt when singularDeviceId is present, otherwise V1 evt.
 */
const getEndpoint = (sessionEvent: boolean, useV2EventApi: boolean): string => {
  if (sessionEvent) {
    return `${BASE_URL}/launch`;
  }
  if (useV2EventApi) {
    return `${BASE_URL_V2}/evt`;
  }
  return `${BASE_URL}/evt`;
};

export {
  generateRevenuePayloadArray,
  getEndpoint,
  isSessionEvent,
  platformWisePayloadGenerator,
  shouldUseV2EventApi,
};
