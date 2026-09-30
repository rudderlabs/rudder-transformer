import { ConfigurationError, InstrumentationError } from '@rudderstack/integrations-lib';
import { constructPayload, getValueFromMessage } from '../../util';
import type { RudderMessage } from '../../../types';
import {
  ANDROID_DEVICE_TYPES,
  BULK_EVENTS_PATH,
  IOS_DEVICE_TYPES,
  MAX_PER_USER_BATCH_BYTES,
  ROKT_EVENTS_API_HOSTS,
  ROKT_INTEGRATION_ID,
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
  required?: boolean;
  sourceFromGenericMap?: boolean;
  metadata?: Record<string, unknown>;
};

type RoktMappingConfig = {
  rootMappings: MappingEntry[];
  identityMappings: MappingEntry[];
  userAttributeMappings: MappingEntry[];
  deviceMappings: MappingEntry[];
  clickIdMappings: MappingEntry[];
  timestampMappings: MappingEntry[];
  conversionTypeMappings: MappingEntry[];
  deviceTypeMappings: MappingEntry[];
  advertisingIdMappings: MappingEntry[];
  iosAdvertisingIdMappings: MappingEntry[];
  androidAdvertisingIdMappings: MappingEntry[];
  conversionAttributeMappings: MappingEntry[];
};

const ROKT_MAPPING_CONFIG = mappingConfig as RoktMappingConfig;

const isPlainRecord = (value: unknown): value is Record<string, unknown> =>
  Object.prototype.toString.call(value) === '[object Object]';

const isPresent = (value: unknown): boolean =>
  value !== undefined && value !== null && !(typeof value === 'string' && value.trim() === '');

const compact = <T extends Record<string, unknown>>(value: T): T =>
  Object.fromEntries(Object.entries(value).filter(([, item]) => isPresent(item))) as T;

const omitWhitespaceOnlyValues = (value: unknown): unknown => {
  if (typeof value === 'string') return value.trim() === '' ? '' : value;
  if (Array.isArray(value)) return value.map(omitWhitespaceOnlyValues);
  if (!isPlainRecord(value)) return value;
  return Object.fromEntries(
    Object.entries(value).map(([key, item]) => [key, omitWhitespaceOnlyValues(item)]),
  );
};

const mappingMessage = (message: RudderMessage): RudderMessage =>
  omitWhitespaceOnlyValues(message) as RudderMessage;

const mappedPayload = (message: RudderMessage, mappings: MappingEntry[]): Record<string, unknown> =>
  (constructPayload(message, mappings) ?? {}) as Record<string, unknown>;

const mappedValue = (message: RudderMessage, mappings: MappingEntry[]): unknown => {
  const [mapping] = mappings;
  return mapping ? getValueFromMessage(message, mapping.sourceKeys) : undefined;
};

const asNonEmptyString = (value: unknown): string | undefined => {
  if (!isPresent(value)) return undefined;
  const stringValue = String(value).trim();
  return stringValue || undefined;
};

export const resolveEndpoint = (apiEndpoint: string): string => {
  let parsed: URL;
  try {
    parsed = new URL(apiEndpoint);
  } catch {
    throw new ConfigurationError('ROKT apiEndpoint must be a valid Rokt Events API URL');
  }

  if (
    parsed.protocol !== 'https:' ||
    !ROKT_EVENTS_API_HOSTS.has(parsed.hostname.toLowerCase()) ||
    parsed.username ||
    parsed.password ||
    parsed.port ||
    parsed.search ||
    parsed.hash ||
    !['', '/'].includes(parsed.pathname)
  ) {
    throw new ConfigurationError(
      'ROKT apiEndpoint must be an approved HTTPS Rokt Events API base URL',
    );
  }

  return `${parsed.origin}${BULK_EVENTS_PATH}`;
};

const resolveClickId = (message: RudderMessage): string | undefined => {
  const propertyValue = mappedValue(message, ROKT_MAPPING_CONFIG.clickIdMappings);
  if (isPresent(propertyValue)) return String(propertyValue);

  const search = asNonEmptyString(getValueFromMessage(message, 'context.page.search'));
  if (!search) return undefined;
  const params = new URLSearchParams(search.startsWith('?') ? search.slice(1) : search);
  const rclid = params.get('rclid');
  if (isPresent(rclid)) return rclid!;
  const rtid = params.get('rtid');
  return isPresent(rtid) ? rtid! : undefined;
};

const resolveTimestamp = (message: RudderMessage): number => {
  const rawTimestamp = mappedValue(message, ROKT_MAPPING_CONFIG.timestampMappings);
  if (!isPresent(rawTimestamp)) {
    throw new InstrumentationError('ROKT conversion requires a timestamp');
  }
  const timestamp = mappedPayload(message, ROKT_MAPPING_CONFIG.timestampMappings)
    .timestamp_unixtime_ms as number;
  if (!Number.isFinite(timestamp)) {
    throw new InstrumentationError('ROKT conversion timestamp is invalid');
  }
  return timestamp;
};

const formatDateOfBirth = (value: unknown): string | undefined => {
  if (!isPresent(value)) return undefined;
  const text = String(value).trim();
  if (/^\d{8}$/.test(text)) return text;
  const date = new Date(text);
  if (Number.isNaN(date.getTime())) return undefined;
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const day = String(date.getUTCDate()).padStart(2, '0');
  return `${year}${month}${day}`;
};

const buildIdentities = (message: RudderMessage, clickId?: string): RoktUserIdentities => {
  const identities = mappedPayload(
    message,
    ROKT_MAPPING_CONFIG.identityMappings,
  ) as RoktUserIdentities;
  const email = asNonEmptyString(identities.email)?.toLowerCase();
  return compact({ ...identities, email, other2: clickId });
};

const buildUserAttributes = (message: RudderMessage): RoktUserAttributes => {
  const attributes = mappedPayload(
    message,
    ROKT_MAPPING_CONFIG.userAttributeMappings,
  ) as RoktUserAttributes;
  return compact({ ...attributes, dob: formatDateOfBirth(attributes.dob) });
};

const buildDeviceInfo = (message: RudderMessage): RoktDeviceInfo => {
  const deviceInfo = mappedPayload(message, ROKT_MAPPING_CONFIG.deviceMappings) as RoktDeviceInfo;
  const deviceType = asNonEmptyString(
    mappedValue(message, ROKT_MAPPING_CONFIG.deviceTypeMappings),
  )?.toLowerCase();
  const advertisingId = mappedValue(message, ROKT_MAPPING_CONFIG.advertisingIdMappings);

  if (deviceType && IOS_DEVICE_TYPES.has(deviceType) && isPresent(advertisingId)) {
    deviceInfo.ios_advertising_id = advertisingId;
  } else if (deviceType && ANDROID_DEVICE_TYPES.has(deviceType) && isPresent(advertisingId)) {
    deviceInfo.android_advertising_id = advertisingId;
  }

  const iosFallback = mappedPayload(
    message,
    ROKT_MAPPING_CONFIG.iosAdvertisingIdMappings,
  ).ios_advertising_id;
  const androidFallback = mappedPayload(
    message,
    ROKT_MAPPING_CONFIG.androidAdvertisingIdMappings,
  ).android_advertising_id;
  if (!isPresent(deviceInfo.ios_advertising_id) && isPresent(iosFallback)) {
    deviceInfo.ios_advertising_id = iosFallback;
  }
  if (!isPresent(deviceInfo.android_advertising_id) && isPresent(androidFallback)) {
    deviceInfo.android_advertising_id = androidFallback;
  }
  return compact(deviceInfo);
};

const buildConversion = (message: RudderMessage): RoktConversion => {
  const customAttributes = mappedPayload(message, ROKT_MAPPING_CONFIG.conversionAttributeMappings);
  const { amount } = customAttributes;
  const type = mappedValue(message, ROKT_MAPPING_CONFIG.conversionTypeMappings);
  let conversiontype = type;
  if (!isPresent(conversiontype) && ['page', 'screen'].includes(message.type)) {
    conversiontype = 'screen_view';
  }
  if (!isPresent(conversiontype)) {
    throw new InstrumentationError('ROKT conversion requires conversiontype');
  }

  return {
    event_type: 'custom_event',
    data: {
      event_name: 'conversion',
      custom_event_type: 'transaction',
      timestamp_unixtime_ms: resolveTimestamp(message),
      ...(asNonEmptyString(message.messageId)
        ? { source_message_id: asNonEmptyString(message.messageId) }
        : {}),
      custom_attributes: compact({
        ...customAttributes,
        conversiontype,
        amount: isPresent(amount) ? String(amount) : undefined,
      }),
    },
  };
};

export const buildRoktBatch = (message: RudderMessage): RoktBatch => {
  const sanitizedMessage = mappingMessage(message);
  const clickId = resolveClickId(sanitizedMessage);
  const identities = buildIdentities(sanitizedMessage, clickId);
  if (message.type !== 'identify' && Object.keys(identities).length === 0) {
    throw new InstrumentationError(
      'ROKT conversion requires at least one supported identity signal',
    );
  }

  const root = mappedPayload(sanitizedMessage, ROKT_MAPPING_CONFIG.rootMappings);
  const userAttributes = buildUserAttributes(sanitizedMessage);
  const deviceInfo = buildDeviceInfo(sanitizedMessage);
  const batch: RoktBatch = {
    schema_version: 2,
    environment: 'production',
    user_identities: identities,
    ...(isPresent(root.ip) ? { ip: root.ip } : {}),
    ...(Object.keys(userAttributes).length > 0 ? { user_attributes: userAttributes } : {}),
    ...(Object.keys(deviceInfo).length > 0 ? { device_info: deviceInfo } : {}),
    ...(clickId
      ? {
          integration_attributes: {
            [ROKT_INTEGRATION_ID]: { passbackconversiontrackingid: clickId },
          },
        }
      : {}),
    ...(message.type === 'identify' ? {} : { events: [buildConversion(sanitizedMessage)] }),
  };

  const batchBytes = Buffer.byteLength(JSON.stringify(batch), 'utf8');
  if (batchBytes > MAX_PER_USER_BATCH_BYTES) {
    throw new InstrumentationError(
      `ROKT per-user batch exceeds the ${MAX_PER_USER_BATCH_BYTES}-byte limit`,
    );
  }
  return batch;
};
