import { InstrumentationError } from '@rudderstack/integrations-lib';
import isPlainObject from 'lodash/isPlainObject';
import { constructPayload, getValueFromMessage, isAndroidFamily, isAppleFamily } from '../../util';
import { DEVICE_PLATFORMS } from './config';
import mappingConfig from './data/PUSHWOOSHConfig.json';
import type {
  PushwooshDestinationConfig,
  PushwooshEvent,
  PushwooshMessage,
  PushwooshSetTagsBody,
  PushwooshValue,
  PushwooshValues,
} from './types';

type MappingEntry = {
  sourceKeys: string | string[];
  destKey: string;
  required?: boolean;
};

type PushwooshMappingConfig = {
  trackMappings: MappingEntry[];
  identifyMappings: MappingEntry[];
  attributesSourceKey: string;
  tagsSourceKeys: string[];
  platformSourceKeys: string[];
  excludedTraitKeys: string[];
};

const MAPPING = mappingConfig as PushwooshMappingConfig;
const EXCLUDED_TRAIT_KEYS = new Set(MAPPING.excludedTraitKeys);

type Scalar = string | number | boolean;

const toScalar = (value: unknown): Scalar =>
  typeof value === 'object' ? JSON.stringify(value) : (value as Scalar);

const toPushwooshValue = (value: unknown): PushwooshValue =>
  Array.isArray(value) ? value.map(toScalar) : toScalar(value);

// Pushwoosh values are scalars or scalar lists: objects go as JSON strings, null/undefined drop.
export const toPushwooshValues = (source: unknown, excludedKeys?: Set<string>): PushwooshValues => {
  if (!isPlainObject(source)) {
    return {};
  }
  return Object.fromEntries(
    Object.entries(source as Record<string, unknown>)
      .filter(([key, value]) => value !== null && value !== undefined && !excludedKeys?.has(key))
      .map(([key, value]) => [key, toPushwooshValue(value)]),
  );
};

export const resolveDevicePlatform = (
  message: PushwooshMessage,
): PushwooshEvent['device_platform'] => {
  const hints = MAPPING.platformSourceKeys.map((path) => getValueFromMessage(message, path));
  if (hints.some(isAndroidFamily)) {
    return DEVICE_PLATFORMS.android;
  }
  if (hints.some(isAppleFamily)) {
    return DEVICE_PLATFORMS.ios;
  }
  return DEVICE_PLATFORMS.web;
};

// post-events decodes `timestamp` as an RFC 3339 string and rejects the whole batch otherwise.
const toRfc3339 = (value: unknown): string | undefined => {
  if (value === undefined) {
    return undefined;
  }
  const date = typeof value === 'string' || typeof value === 'number' ? new Date(value) : null;
  if (!date || Number.isNaN(date.getTime())) {
    throw new InstrumentationError(`Invalid timestamp: ${JSON.stringify(value)}`);
  }
  return date.toISOString();
};

export const buildPushwooshEvent = (
  message: PushwooshMessage,
  { appCode }: PushwooshDestinationConfig,
): PushwooshEvent => {
  const mapped = constructPayload(message, MAPPING.trackMappings) as Record<string, unknown>;
  return {
    user_id: String(mapped.user_id),
    device_id: mapped.device_id === undefined ? '' : String(mapped.device_id),
    device_platform: resolveDevicePlatform(message),
    app_code: appCode,
    name: String(mapped.name),
    timestamp: toRfc3339(mapped.timestamp),
    attributes: toPushwooshValues(getValueFromMessage(message, MAPPING.attributesSourceKey)),
  };
};

export const buildSetTagsBody = (
  message: PushwooshMessage,
  { appCode }: PushwooshDestinationConfig,
): PushwooshSetTagsBody => {
  const { userId } = constructPayload(message, MAPPING.identifyMappings) as { userId: unknown };
  const tags = toPushwooshValues(
    getValueFromMessage(message, MAPPING.tagsSourceKeys),
    EXCLUDED_TRAIT_KEYS,
  );
  if (Object.keys(tags).length === 0) {
    throw new InstrumentationError('No traits left to send as Pushwoosh tags');
  }
  return { request: { application: appCode, userId: String(userId), tags } };
};
