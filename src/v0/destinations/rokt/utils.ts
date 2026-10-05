import { ConfigurationError } from '@rudderstack/integrations-lib';
import { get, isPlainObject, set } from 'lodash';
import {
  constructPayload,
  formatTimeStamp,
  getValueFromMessage,
  isAndroidFamily,
  isAppleFamily,
  isValidUrl,
} from '../../util';
import type { RudderMessage } from '../../../types';
import {
  ADVERTISING_ID_SOURCE_KEY,
  BULK_EVENTS_PATH,
  CLICK_ID_SOURCE_KEYS,
  CONVERSION_TYPE_SOURCE_KEYS,
  DEVICE_TYPE_SOURCE_KEY,
  IP_SOURCE_KEYS,
  PAGE_SEARCH_SOURCE_KEY,
  ROKT_INTEGRATION_ID,
  TIMESTAMP_SOURCE_KEYS,
} from './config';
import mappingConfig from './data/ROKTConfig.json';
import type {
  RoktBatch,
  RoktConversion,
  RoktDeviceInfo,
  RoktUserAttributes,
  RoktUserIdentities,
} from './types';

type MappingEntry = {
  sourceKeys: string | string[];
  destKey: string;
  metadata?: Record<string, unknown>;
};

const ROKT_MAPPING_CONFIG = mappingConfig as Record<keyof typeof mappingConfig, MappingEntry[]>;

// Every message path the transform reads; buildRoktBatch copies only these.
const MAPPED_PATHS = [
  ...new Set(
    [
      ...Object.values(ROKT_MAPPING_CONFIG)
        .flat()
        .flatMap(({ sourceKeys }) => sourceKeys),
      ...IP_SOURCE_KEYS,
      ...CLICK_ID_SOURCE_KEYS,
      PAGE_SEARCH_SOURCE_KEY,
      ...TIMESTAMP_SOURCE_KEYS,
      ...CONVERSION_TYPE_SOURCE_KEYS,
      DEVICE_TYPE_SOURCE_KEY,
      ADVERTISING_ID_SOURCE_KEY,
    ].flat(),
  ),
];

const isPresent = (value: unknown): boolean =>
  value !== undefined && value !== null && !(typeof value === 'string' && value.trim() === '');

const compact = <T extends Record<string, unknown>>(value: T): T =>
  Object.fromEntries(Object.entries(value).filter(([, item]) => isPresent(item))) as T;

const omitWhitespaceOnlyValues = (value: unknown): unknown => {
  if (typeof value === 'string') return value.trim() === '' ? '' : value;
  if (Array.isArray(value)) return value.map(omitWhitespaceOnlyValues);
  if (!isPlainObject(value)) return value;
  return Object.fromEntries(
    Object.entries(value as Record<string, unknown>).map(([key, item]) => [
      key,
      omitWhitespaceOnlyValues(item),
    ]),
  );
};

// Blanking whitespace-only strings lets getValueFromMessage fall through to the next source key.
const sanitizeMappedPaths = (message: RudderMessage): RudderMessage => {
  const view = {} as RudderMessage;
  for (const path of MAPPED_PATHS) {
    const value: unknown = get(message, path);
    if (value !== undefined) set(view, path, omitWhitespaceOnlyValues(value));
  }
  return view;
};

const mappedPayload = (message: RudderMessage, mappings: MappingEntry[]): Record<string, unknown> =>
  (constructPayload(message, mappings) ?? {}) as Record<string, unknown>;

const asNonEmptyString = (value: unknown): string | undefined => {
  if (!isPresent(value)) return undefined;
  const stringValue = String(value).trim();
  return stringValue || undefined;
};

export const resolveEndpoint = (apiEndpoint: string): string => {
  const parsed = isValidUrl(apiEndpoint);
  if (!parsed) {
    throw new ConfigurationError('ROKT apiEndpoint must be a valid Rokt Events API URL');
  }

  if (
    parsed.protocol !== 'https:' ||
    !parsed.hostname.toLowerCase().endsWith('.mparticle.com') ||
    parsed.username ||
    parsed.password ||
    parsed.port ||
    parsed.search ||
    parsed.hash ||
    !['', '/'].includes(parsed.pathname)
  ) {
    throw new ConfigurationError('ROKT apiEndpoint must be a valid HTTPS Rokt Events API base URL');
  }

  return `${parsed.origin}${BULK_EVENTS_PATH}`;
};

// Shared with delivery, which maps Rokt's error positions back onto this exact serialization.
export const serializeRoktBatches = (batches: unknown[]): string => JSON.stringify(batches);

const resolveClickId = (message: RudderMessage): string | undefined => {
  const propertyValue = getValueFromMessage(message, CLICK_ID_SOURCE_KEYS);
  if (isPresent(propertyValue)) return String(propertyValue);

  const search = asNonEmptyString(getValueFromMessage(message, PAGE_SEARCH_SOURCE_KEY));
  if (!search) return undefined;
  const params = new URLSearchParams(search);
  return [params.get('rclid'), params.get('rtid')].find(isPresent) ?? undefined;
};

const resolveTimestamp = (message: RudderMessage): number | undefined => {
  const rawTimestamp = getValueFromMessage(message, TIMESTAMP_SOURCE_KEYS);
  if (!isPresent(rawTimestamp)) return undefined;
  const timestamp = new Date(rawTimestamp as string | number).getTime();
  return Number.isFinite(timestamp) ? timestamp : undefined;
};

const formatDateOfBirth = (value: unknown): string | undefined => {
  if (!isPresent(value)) return undefined;
  const text = String(value).trim();
  if (/^\d{8}$/.test(text)) return text;
  const date = new Date(text);
  if (Number.isNaN(date.getTime())) return undefined;
  return formatTimeStamp(date, 'YYYYMMDD') as string;
};

const buildIdentities = (message: RudderMessage, clickId?: string): RoktUserIdentities => {
  const identities = mappedPayload(
    message,
    ROKT_MAPPING_CONFIG.identityMappings,
  ) as RoktUserIdentities;
  const email = asNonEmptyString(identities.email)?.toLowerCase();
  const customerid = isPresent(identities.customerid) ? String(identities.customerid) : undefined;
  return compact({ ...identities, email, customerid, other2: clickId });
};

const buildUserAttributes = (message: RudderMessage): RoktUserAttributes => {
  const attributes = mappedPayload(
    message,
    ROKT_MAPPING_CONFIG.userAttributeMappings,
  ) as RoktUserAttributes;
  return compact({ ...attributes, dob: formatDateOfBirth(attributes.dob) });
};

// The trait-based ids come from deviceMappings; a typed context.device.advertisingId overrides them.
const buildDeviceInfo = (message: RudderMessage): RoktDeviceInfo => {
  const deviceInfo = mappedPayload(message, ROKT_MAPPING_CONFIG.deviceMappings) as RoktDeviceInfo;
  const advertisingId = getValueFromMessage(message, ADVERTISING_ID_SOURCE_KEY);

  if (isPresent(advertisingId)) {
    const deviceType = asNonEmptyString(getValueFromMessage(message, DEVICE_TYPE_SOURCE_KEY));
    if (isAppleFamily(deviceType)) {
      deviceInfo.ios_advertising_id = advertisingId;
    } else if (isAndroidFamily(deviceType)) {
      deviceInfo.android_advertising_id = advertisingId;
    }
  }
  return compact(deviceInfo);
};

const buildConversion = (
  message: RudderMessage,
  { type, messageId }: RudderMessage,
): RoktConversion => {
  const customAttributes = mappedPayload(message, ROKT_MAPPING_CONFIG.conversionAttributeMappings);
  const { amount } = customAttributes;
  let conversiontype = getValueFromMessage(message, CONVERSION_TYPE_SOURCE_KEYS);
  if (!isPresent(conversiontype) && ['page', 'screen'].includes(type)) {
    conversiontype = 'screen_view';
  }
  const timestamp = resolveTimestamp(message);
  const sourceMessageId = asNonEmptyString(messageId);

  return {
    event_type: 'custom_event',
    data: {
      event_name: 'conversion',
      custom_event_type: 'transaction',
      ...(timestamp !== undefined ? { timestamp_unixtime_ms: timestamp } : {}),
      ...(sourceMessageId ? { source_message_id: sourceMessageId } : {}),
      custom_attributes: compact({
        ...customAttributes,
        conversiontype,
        amount: isPresent(amount) ? String(amount) : undefined,
      }),
    },
  };
};

export const buildRoktBatch = (message: RudderMessage): RoktBatch => {
  const sanitizedMessage = sanitizeMappedPaths(message);
  const clickId = resolveClickId(sanitizedMessage);
  const identities = buildIdentities(sanitizedMessage, clickId);

  const ip = getValueFromMessage(sanitizedMessage, IP_SOURCE_KEYS);
  const userAttributes = buildUserAttributes(sanitizedMessage);
  const deviceInfo = buildDeviceInfo(sanitizedMessage);
  return {
    schema_version: 2,
    environment: 'production',
    user_identities: identities,
    ...(isPresent(ip) ? { ip } : {}),
    ...(Object.keys(userAttributes).length > 0 ? { user_attributes: userAttributes } : {}),
    ...(Object.keys(deviceInfo).length > 0 ? { device_info: deviceInfo } : {}),
    ...(clickId
      ? {
          integration_attributes: {
            [ROKT_INTEGRATION_ID]: { passbackconversiontrackingid: clickId },
          },
        }
      : {}),
    ...(message.type === 'identify'
      ? {}
      : { events: [buildConversion(sanitizedMessage, message)] }),
  };
};
