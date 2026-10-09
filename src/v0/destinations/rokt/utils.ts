import { ConfigurationError } from '@rudderstack/integrations-lib';
import { isPlainObject, pick } from 'lodash';
import {
  constructPayload,
  formatTimeStamp,
  isAndroidFamily,
  isAppleFamily,
  isValidUrl,
} from '../../util';
import type { RudderMessage } from '../../../types';
import { BULK_EVENTS_PATH, ROKT_INTEGRATION_ID } from './config';
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
};

const ROKT_MAPPING_CONFIG = mappingConfig as Record<keyof typeof mappingConfig, MappingEntry[]>;

// Every message path the transform reads; buildRoktBatch copies only these.
const MAPPED_PATHS = Object.values(ROKT_MAPPING_CONFIG)
  .flat()
  .flatMap(({ sourceKeys }) => sourceKeys);

// Single values the transform post-processes before placing them in the batch.
type MessageValues = {
  ip?: unknown;
  click_id?: unknown;
  timestamp?: unknown;
  conversiontype?: unknown;
  device_type?: unknown;
  advertising_id?: unknown;
  page_search?: unknown;
};

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

// Copies only the mapped paths. Blanking whitespace-only strings lets getValueFromMessage fall
// through to the next source key.
const sanitizeMappedPaths = (message: RudderMessage): RudderMessage =>
  omitWhitespaceOnlyValues(pick(message, MAPPED_PATHS)) as RudderMessage;

const mappedPayload = (message: RudderMessage, mappings: MappingEntry[]): Record<string, unknown> =>
  (constructPayload(message, mappings) ?? {}) as Record<string, unknown>;

const asNonEmptyString = (value: unknown): string | undefined => {
  if (!isPresent(value)) return undefined;
  const stringValue = String(value).trim();
  return stringValue || undefined;
};

const normalizeEndpointPath = (apiEndpoint: string, parsed: URL): string | undefined => {
  // URL.pathname canonicalizes dot segments and treats backslashes as separators for HTTPS URLs,
  // so validate the original path spelling before using it.
  if (apiEndpoint.includes('\\')) return undefined;
  const rawUrl = /^[A-Za-z][\d+.A-Za-z-]*:\/\/([^#/?]+)([^#?]*)/.exec(apiEndpoint);
  if (!rawUrl) return undefined;

  const [, rawAuthority, rawPath] = rawUrl;
  const rawAuthorityUrl = isValidUrl(`${parsed.protocol}//${rawAuthority}`);
  if (
    !rawAuthorityUrl ||
    rawAuthorityUrl.host !== parsed.host ||
    rawAuthorityUrl.username !== parsed.username ||
    rawAuthorityUrl.password !== parsed.password
  ) {
    return undefined;
  }

  if (rawPath === '' || rawPath === '/') return '';

  const normalizedPath = rawPath.endsWith('/') ? rawPath.slice(0, -1) : rawPath;
  const segments = normalizedPath.slice(1).split('/');
  const validSegments = segments.every(
    (segment) => segment !== '.' && segment !== '..' && /^[\w.~-]+$/.test(segment),
  );

  if (!normalizedPath.startsWith('/') || rawPath.includes('%') || !validSegments) return undefined;
  return normalizedPath;
};

export const resolveEndpoint = (apiEndpoint: string): string => {
  const parsed = isValidUrl(apiEndpoint);
  if (!parsed) {
    throw new ConfigurationError('ROKT apiEndpoint must be a valid Rokt Events API URL');
  }

  const host = parsed.hostname.toLowerCase();
  const hostAllowed = host === 'mparticle.com' || host.endsWith('.mparticle.com');
  const normalizedPath = normalizeEndpointPath(apiEndpoint, parsed);

  if (
    parsed.protocol !== 'https:' ||
    !hostAllowed ||
    parsed.username ||
    parsed.password ||
    parsed.port ||
    parsed.search ||
    parsed.hash ||
    normalizedPath === undefined
  ) {
    throw new ConfigurationError('ROKT apiEndpoint must be a valid HTTPS Rokt Events API base URL');
  }

  return `${parsed.origin}${normalizedPath}${BULK_EVENTS_PATH}`;
};

// Shared with delivery, which maps Rokt's error positions back onto this exact serialization.
export const serializeRoktBatches = (batches: unknown[]): string => JSON.stringify(batches);

const resolveClickId = ({
  click_id: propertyValue,
  page_search: pageSearch,
}: MessageValues): string | undefined => {
  if (isPresent(propertyValue)) return String(propertyValue);

  const search = asNonEmptyString(pageSearch);
  if (!search) return undefined;
  const params = new URLSearchParams(search);
  return [params.get('rclid'), params.get('rtid')].find(isPresent) ?? undefined;
};

const resolveTimestamp = (rawTimestamp: unknown): number | undefined => {
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
const buildDeviceInfo = (
  message: RudderMessage,
  { advertising_id: advertisingId, device_type: rawDeviceType }: MessageValues,
): RoktDeviceInfo => {
  const deviceInfo = mappedPayload(message, ROKT_MAPPING_CONFIG.deviceMappings) as RoktDeviceInfo;

  if (isPresent(advertisingId)) {
    const deviceType = asNonEmptyString(rawDeviceType);
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
  values: MessageValues,
  type: string,
  messageId?: string,
): RoktConversion => {
  const customAttributes = mappedPayload(message, ROKT_MAPPING_CONFIG.conversionAttributeMappings);
  const { amount } = customAttributes;
  let { conversiontype } = values;
  if (!isPresent(conversiontype) && ['page', 'screen'].includes(type)) {
    conversiontype = 'screen_view';
  }
  const timestamp = resolveTimestamp(values.timestamp);
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
  const values = mappedPayload(
    sanitizedMessage,
    ROKT_MAPPING_CONFIG.messageValueMappings,
  ) as MessageValues;
  const clickId = resolveClickId(values);
  const identities = buildIdentities(sanitizedMessage, clickId);

  const userAttributes = buildUserAttributes(sanitizedMessage);
  const deviceInfo = buildDeviceInfo(sanitizedMessage, values);
  return {
    schema_version: 2,
    environment: 'production',
    user_identities: identities,
    ...(isPresent(values.ip) ? { ip: values.ip } : {}),
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
      : { events: [buildConversion(sanitizedMessage, values, message.type, message.messageId)] }),
  };
};
